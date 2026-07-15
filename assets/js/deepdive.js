(function () {
    "use strict";

    var SUBMIT_ENDPOINT = "/api/submit-deep-dive";
    var REDIRECT_URL = "https://pages.razorpay.com/pl_TCtjt78IKqBkHu/view";
    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var isSubmitting = false;

    function getButton() {
        return document.getElementById("ddSubmitBtn");
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

    async function submitDeepDiveForm(event) {
        if (event) event.preventDefault();
        if (isSubmitting) return;

        var nameEl = document.getElementById("ddName");
        var companyEl = document.getElementById("ddCompany");
        var emailEl = document.getElementById("ddEmail");
        var creatorsEl = document.getElementById("ddCreators");
        var decisionEl = document.getElementById("ddDecision");
        var partnershipValueEl = document.getElementById("ddPartnershipValue");
        var contextEl = document.getElementById("ddContext");

        var name = nameEl ? nameEl.value.trim() : "";
        var company = companyEl ? companyEl.value.trim() : "";
        var email = emailEl ? emailEl.value.trim() : "";
        var creators = creatorsEl ? creatorsEl.value.trim() : "";
        var decision = decisionEl ? decisionEl.value.trim() : "";
        var partnershipValue = partnershipValueEl ? partnershipValueEl.value.trim() : "";
        var context = contextEl ? contextEl.value.trim() : "";

        if (!name || !company || !email || !creators || !decision || !partnershipValue) {
            alert("Please fill all required fields.");
            return;
        }

        if (!EMAIL_PATTERN.test(email)) {
            alert("Please enter a valid email address.");
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
                    company: company,
                    email: email,
                    creators: creators,
                    decision: decision,
                    partnershipValue: partnershipValue,
                    context: context
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

    window.submitDeepDiveForm = submitDeepDiveForm;
})();
