(function () {
    "use strict";

    var SUBMIT_ENDPOINT = "/api/submit";
    var REDIRECT_URL = "https://pages.razorpay.com/pl_TCtjt78IKqBkHu/view";

    var isSubmitting = false;

    function getButton() {
        return document.getElementById("submitBtn");
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

    async function submitForm(event) {
        if (event) event.preventDefault();
        if (isSubmitting) return;

        var creatorAEl = document.getElementById("creatorA");
        var creatorBEl = document.getElementById("creatorB");
        var brandNameEl = document.getElementById("brandName");
        var campaignContextEl = document.getElementById("campaignContext");

        var creatorA = creatorAEl ? creatorAEl.value.trim() : "";
        var creatorB = creatorBEl ? creatorBEl.value.trim() : "";
        var brandName = brandNameEl ? brandNameEl.value.trim() : "";
        var campaignContext = campaignContextEl ? campaignContextEl.value.trim() : "";

        if (!creatorA || !creatorB) {
            alert("Please enter both Creator A and Creator B Instagram handles.");
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
                    creatorA: creatorA,
                    creatorB: creatorB,
                    brandName: brandName,
                    campaignContext: campaignContext
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

    window.submitForm = submitForm;
})();
