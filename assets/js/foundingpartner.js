(function () {
    "use strict";

    var SUBMIT_ENDPOINT = "/api/submit-founding-partner";
    var REDIRECT_URL = "https://pages.razorpay.com/pl_TCtjt78IKqBkHu/view";
    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var isSubmitting = false;

    function getButton() {
        return document.getElementById("fpSubmitBtn");
    }

    function setLoadingState(button, loading) {
        if (!button) return;

        if (loading) {
            if (button.dataset.originalHtml === undefined) {
                button.dataset.originalHtml = button.innerHTML;
            }
            button.innerHTML = "Submitting...";
            button.style.pointerEvents = "none";
            button.style.opacity = "0.6";
            button.setAttribute("aria-disabled", "true");
        } else {
            if (button.dataset.originalHtml !== undefined) {
                button.innerHTML = button.dataset.originalHtml;
            }
            button.style.pointerEvents = "";
            button.style.opacity = "";
            button.removeAttribute("aria-disabled");
        }
    }

    function isValidUrl(value) {
        try {
            var url = new URL(value);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (e) {
            return false;
        }
    }

    async function submitFoundingPartnerForm(event) {
        if (event) event.preventDefault();
        if (isSubmitting) return;

        var nameEl = document.getElementById("fpName");
        var emailEl = document.getElementById("fpEmail");
        var companyEl = document.getElementById("fpCompany");
        var websiteEl = document.getElementById("fpWebsite");
        var industryEl = document.getElementById("fpIndustry");
        var creatorUsageEl = document.getElementById("fpCreatorUsage");
        var productInterestEl = document.getElementById("fpProductInterest");
        var objectiveEl = document.getElementById("fpObjective");
        var notesEl = document.getElementById("fpNotes");

        var name = nameEl ? nameEl.value.trim() : "";
        var email = emailEl ? emailEl.value.trim() : "";
        var company = companyEl ? companyEl.value.trim() : "";
        var website = websiteEl ? websiteEl.value.trim() : "";
        var industry = industryEl ? industryEl.value : "";
        var creatorUsage = creatorUsageEl ? creatorUsageEl.value : "";
        var productInterest = productInterestEl ? productInterestEl.value : "";
        var objective = objectiveEl ? objectiveEl.value.trim() : "";
        var notes = notesEl ? notesEl.value.trim() : "";

        if (!name || !email || !company || !website || !industry) {
            alert("Please fill all required fields.");
            return;
        }

        if (!EMAIL_PATTERN.test(email)) {
            alert("Please enter a valid work email address.");
            return;
        }

        if (!isValidUrl(website)) {
            alert("Please enter a valid website URL (including https://).");
            return;
        }

        var button = getButton();
        isSubmitting = true;
        setLoadingState(button, true);

        try {
            var response = await fetch(SUBMIT_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    company: company,
                    website: website,
                    industry: industry,
                    creatorUsage: creatorUsage,
                    productInterest: productInterest,
                    objective: objective,
                    notes: notes
                })
            });

            var result = null;
            try {
                result = await response.json();
            } catch (parseError) {
                result = null;
            }

            if (response.ok && result && result.success) {
                window.location.href = REDIRECT_URL;
                return;
            }

            var message = (result && result.message) ? result.message : "Submission failed. Please try again.";
            alert(message);
            isSubmitting = false;
            setLoadingState(button, false);
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please check your connection and try again.");
            isSubmitting = false;
            setLoadingState(button, false);
        }
    }

    window.submitFoundingPartnerForm = submitFoundingPartnerForm;
})();
