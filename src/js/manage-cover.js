document.addEventListener('DOMContentLoaded', function () {
    const coverwiseForm = getCookie('coverwise_form');

    // Show quick cover card only if cookie value is 'sf'
    const quickCoverCard = document.getElementById('quick-cover-card');
    if (quickCoverCard) {
        quickCoverCard.style.display = coverwiseForm === 'lf' ? 'none' : '';
    }

    // Conditional questions display logic
    const sfQuestions = document.getElementById('conditional-questions');
    const lfQuestions = document.getElementById('conditional-questions-lf');
    if (coverwiseForm === 'sf') {
        if (sfQuestions) sfQuestions.style.display = '';
        if (lfQuestions) lfQuestions.style.display = 'none';
    } else if (coverwiseForm === 'lf') {
        if (sfQuestions) sfQuestions.style.display = 'none';
        if (lfQuestions) lfQuestions.style.display = '';
    } else {
        if (sfQuestions) sfQuestions.style.display = '';
        if (lfQuestions) lfQuestions.style.display = '';
    }

    // Preselect radio buttons as "No" if cookie value is 'sf'
    if (coverwiseForm === 'sf') {
        const restrictedNo = document.querySelector('input[name="restricted-duties"][value="no"]');
        const lifeExpNo = document.querySelector('input[name="life-expectancy"][value="no"]');
        if (restrictedNo) restrictedNo.checked = true;
        if (lifeExpNo) lifeExpNo.checked = true;
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