document.addEventListener('DOMContentLoaded', function () {
    // Check cookie value on load
    const coverwiseForm = getCookie('coverwise_form');
    const conditionalQuestions = document.getElementById('conditional-questions');
    if (conditionalQuestions) {
        if (coverwiseForm) {
            conditionalQuestions.style.display = 'none';
        } else {
            conditionalQuestions.style.display = '';
        }
    }

    const form = document.querySelector('.form-section');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        // Example: Collect form data
        const email = form.querySelector('#email').value;
        const occupation = form.querySelector('#occupation').value;
        const eligibility = form.querySelector('input[name="permanent-inability"]:checked')?.value;

        // You can add validation or send this data to a server here
        alert(
            `Submitted:\nEmail: ${email}\nOccupation: ${occupation}\nEligibility: ${eligibility ? eligibility : 'Not answered'}`
        );
    });
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return '';
}

function navigate(path) {
    window.location.href = path;
}