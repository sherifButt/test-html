import { surveyJson7 } from './surveyJson.js';

const survey = new Survey.Model(surveyJson7);

// const data = [
//     {
//     "output": 
//     "Dear User,\n\nThank you for reaching out to us regarding Hajj. We understand the importance of this pilgrimage and we are committed to providing you with the best assistance possible.\n\nI have noted your inquiry and I will make sure that it is addressed promptly. Our team will get back to you as soon as possible with all the necessary information.\n\nThank you for your patience and understanding.\n\nBest regards,\n[Your Name]"
//     }
//     ]

// Function to send survey data to the webhook and display a custom thank you message
async function sendSurveyResults(sender) {
    const resultAsString = JSON.stringify(sender.data);
    sender.completedHtml = '<div class="spinner" style="text-align:center;"><img src="img/spinner.gif" alt="Loading..." width="40px"></div>';

    try {
        const response = await fetch('https://n8n.loyalleads.co.uk/webhook/a8b4aaca-3cfd-40e4-b361-687e9b0ea19e', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: resultAsString,
        });
        const data = await response.json();
        console.log('Success:', data);
        const formattedMessage = data.output.split('\n\n').map((paragraph, index) => {
            return index === 0 ? `<p>${paragraph}</p>` : `<p>${paragraph}</p>`;
        }).join('');

        sender.completedHtml = `<article style="white-space: pre-line; text-align:left; ">${formattedMessage}</article>`;
    } catch (error) {
        console.error('Error:', error);
        sender.completedHtml = "There was an error submitting your survey. Please try again later.";
    }
}

survey.onComplete.add(sendSurveyResults);

// Function to update the visibility of the next and previous buttons
function updateNavigationButtonsVisibility() {
    const currentPage = survey.currentPage;
    let hideButtons = false;

    currentPage.questions.forEach(question => {
        if (question.getType() === 'radiogroup') {
            hideButtons = true;
        }
    });

    const nextButton = document.querySelector('.sd-navigation__next-btn');
    const prevButton = document.querySelector('.sd-navigation__prev-btn');

    if (nextButton) {
        nextButton.style.display = hideButtons ? 'none' : 'inline-block';
    }
    if (prevButton) {
        prevButton.style.display = hideButtons ? 'none' : 'inline-block';
    }
}

// Subscribe to onValueChanged to track the answered questions status
survey.onValueChanged.add(function(sender, options) {
    updateNavigationButtonsVisibility();
});

// Also update the visibility when the current page changes
survey.onCurrentPageChanged.add(function(sender) {
    updateNavigationButtonsVisibility();
});

// Ensure the next button visibility is updated after the page is rendered
survey.onAfterRenderPage.add(function(sender) {
    updateNavigationButtonsVisibility();
});

document.addEventListener("DOMContentLoaded", function() {
    ko.applyBindings({
        model: survey,
    });

    // Initial call to set the correct visibility of the navigation buttons after the survey is mounted
    updateNavigationButtonsVisibility();
});
