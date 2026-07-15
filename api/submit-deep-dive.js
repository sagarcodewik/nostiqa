const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const SHEET_RANGE = "DeepDive!A:J";
const MAX_SHORT_FIELD_LENGTH = 150;
const MAX_CONTEXT_LENGTH = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Comma-separated list of origins allowed to call this endpoint, e.g.
// "https://nostiqa-xi.vercel.app,https://www.nostiqa.com"
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

function getClientIp(req) {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string" && forwarded.length > 0) {
        return forwarded.split(",")[0].trim();
    }
    return (req.socket && req.socket.remoteAddress) || "";
}

function applyCors(req, res) {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setHeader("Vary", "Origin");
    }
}

function loadCredentials(rawValue) {
    const trimmed = rawValue.trim();

    if (trimmed.startsWith("{")) {
        return JSON.parse(trimmed);
    }

    // Treat the value as a path to a service-account JSON file (useful for
    // local development with `vercel dev`). This file must never be
    // committed to git and will not exist in a deployed function bundle
    // unless it was uploaded as part of the project, so production
    // deployments should set the raw JSON content instead.
    const filePath = path.isAbsolute(trimmed) ? trimmed : path.join(process.cwd(), trimmed);
    const fileContents = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContents);
}

function parseBody(req) {
    if (req.body && typeof req.body === "object") {
        return req.body;
    }
    if (typeof req.body === "string" && req.body.length > 0) {
        return JSON.parse(req.body);
    }
    return null;
}

module.exports = async function handler(req, res) {
    applyCors(req, res);

    if (req.method === "OPTIONS") {
        res.status(204).end();
        return;
    }

    if (req.method !== "POST") {
        res.status(405).json({ success: false, message: "Method not allowed." });
        return;
    }

    let body;
    try {
        body = parseBody(req);
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid JSON payload." });
        return;
    }

    if (!body || typeof body !== "object") {
        res.status(400).json({ success: false, message: "Invalid JSON payload." });
        return;
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const company = typeof body.company === "string" ? body.company.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const creators = typeof body.creators === "string" ? body.creators.trim() : "";
    const decision = typeof body.decision === "string" ? body.decision.trim() : "";
    const partnershipValue = typeof body.partnershipValue === "string" ? body.partnershipValue.trim() : "";
    const context = typeof body.context === "string" ? body.context.trim() : "";

    if (!name || !company || !email || !creators || !decision || !partnershipValue) {
        res.status(422).json({ success: false, message: "Please fill all required fields." });
        return;
    }

    if (!EMAIL_PATTERN.test(email)) {
        res.status(422).json({ success: false, message: "Please enter a valid email address." });
        return;
    }

    const shortFields = { name, company, email, creators, decision, partnershipValue };
    for (const [field, value] of Object.entries(shortFields)) {
        if (value.length > MAX_SHORT_FIELD_LENGTH) {
            res.status(422).json({
                success: false,
                message: `${field} must be under ${MAX_SHORT_FIELD_LENGTH} characters.`,
            });
            return;
        }
    }

    if (context.length > MAX_CONTEXT_LENGTH) {
        res.status(422).json({
            success: false,
            message: `Additional context must be under ${MAX_CONTEXT_LENGTH} characters.`,
        });
        return;
    }

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

    if (!spreadsheetId || !serviceAccountJson) {
        console.error("[api/submit-deep-dive] Missing GOOGLE_SHEET_ID or GOOGLE_SERVICE_ACCOUNT_JSON env var.");
        res.status(500).json({ success: false, message: "Unable to save your submission. Please try again later." });
        return;
    }

    const ipAddress = getClientIp(req);
    const userAgent = (req.headers["user-agent"] || "").slice(0, 500);

    try {
        const credentials = loadCredentials(serviceAccountJson);

        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        const row = [
            new Date().toISOString(),
            name,
            company,
            email,
            creators,
            decision,
            partnershipValue,
            context,
            ipAddress,
            userAgent,
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: SHEET_RANGE,
            valueInputOption: "RAW",
            requestBody: { values: [row] },
        });

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("[api/submit-deep-dive]", error);
        res.status(500).json({ success: false, message: "Unable to save your submission. Please try again later." });
    }
};
