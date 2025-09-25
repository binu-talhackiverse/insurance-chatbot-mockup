let conversationHistory = [
    {
        role: "system",
        content: `You are an insurance assistant.
Your job is to help users select the correct journey: Transfer,Manage Cover or Life Events.
If the user's request is unclear, ask clarifying questions to understand their intent.
If the user mentions multiple needs, help them prioritise or handle one at a time.
Be concise, friendly and helpful.
If the user's needs match Manage Cover, do the following:
- Ask these three eligibility questions on at a time, waiting for the user's answer before asking the next:
1) Have you been told by a medical practitioner that your life expectancy could be less than 24 months due to illness or injury?
2) Are you currently restricted from performing all of your normal and usual duties due to illness or injury?
3) Have you ever experienced any medical conditions, treatments, or claims related to illness or injury that could affect your ability to work or your eligibility for insurance or benefits?
- If the answer is "Yes" to the first question, then suggest that the user in ineligible for cover.
- If the answer is "No" for the first and second question then display the third question.
- If the answer is "No" for the first question and "Yes" for the second or third question, recommend the Long form. Otherwise, recommend short form.
- For long form, mention that it will take 15 minutes to complete the application.
- For short form, mention it will take 5 minutes to complete the application.
- Do not ask about journey selection again once the user has chosen manage Cover, unless the user changes their intent.
- The ineligible message should be "Unfortunately, based on the information provided, you are not able to apply for cover at this time. You may be able to apply should your medical situation improve. Your current insurance cover and costs will remain unchanged. If you have any questions or would like further information, you can contact us."
- If an answer is missing, ask for it before making recommendation.
- Do not repeat questions that have already been answered.
- For other journeys, do not ask these eligibility questions.
- If the user needs matches Life events, then suggest Life Events journey with info that the user may apply for up to $200,000 in additional cover (death only or death & TPD). After this increase, your total cover must not exceed $3,000,000 for either option. The life event must have occurred within the past 90 days.

- Once you recommend a journey, please highlight the journey name in bold and italic,  In your response
- Make sure the recommended journey name is highlighted as bold and italic

Be clear and concise`
    }
];

document.getElementById('chatbot-form').onsubmit = async function(e) {
    e.preventDefault();
    const input = document.getElementById('chatbot-input');
    const msg = input.value.trim();
    if (!msg) return;
    addMessage(msg, 'user-message');
    input.value = '';

    // Add user message to conversation history
    conversationHistory.push({ role: "user", content: msg });

    // Use Azure AI function with conversation history
    const botReply = await getAzureAIResponse(conversationHistory);

    // Set cookie based on recommendation (hidden from user)
    let formType = '';
    let journey = '';
    
    if (/long form/i.test(botReply) || /short form/i.test(botReply)) {
        setCookie('coverwise_form', /long form/i.test(botReply) ? 'lf' : 'sf', 7);
        journey = 'Manage Cover';
    } else if (/transfer/i.test(botReply)) {
        journey = 'Transfer';
    } else if (/life events?/i.test(botReply)) {
        journey = 'Life Events';
    } else {
        setCookie('coverwise_form', '', 7);
    }
journey = '';
    const journeyMatch = botReply.match(/\*\_(.*?)\_\*/);
    if (journeyMatch && journeyMatch[1]) {
        journey = journeyMatch[1].trim();
    }

    // Remove "long form" and "short form" from the reply before displaying
    let displayReply = botReply
        .replace(/long form/gi, "Manage Cover journey")
        .replace(/short form/gi, "Manage Cover journey");

        // Convert journey names between **_ and _** to bold text
displayReply = displayReply.replace(/\*\_(.*?)\_\*/g, "$1");

    // If the reply only contains the recommendation, simplify further
    if (formType && /^Based on your answers, I recommend you complete the (long|short) form\./i.test(botReply.trim())) {
        displayReply = "You can proceed with the Manage Cover journey.";
    }

    addMessage(displayReply, 'bot-message', journey);

    // Add bot reply to conversation history
    conversationHistory.push({ role: "assistant", content: botReply });
};

// Helper function to set cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    console.log(`Cookie set: ${name}=${value}`);
}

// Modified to accept conversation history
async function getAzureAIResponse(messages) {
    //const endpoint = "https://coverwise-agent-1-resource.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2025-01-01-preview";
    const endpoint = "https://coverwise-agent-2-resource.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2025-01-01-preview";
    //const apiKey = "52w2QlkgQXDsYAnzT6nc6IJpjSQeVvylVMt8pKdmO8cGKCNJ8q5aJQQJ99BIACYeBjFXJ3w3AAAAACOGr2Z1";
    const apiKey = "3FDZ7qPgm76RvBHoUzkBJohNNq98vomB6Z20k4qooaO3biogOkaiJQQJ99BIACYeBjFXJ3w3AAAAACOGjuBl";

    const payload = {
        "messages": messages,
        "max_tokens": 100,
        "temperature": 0.7
    };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error("Azure AI service error");
        }

        const data = await response.json();
        // Adjust this path based on Azure's actual response structure
        return data.choices[0].message.content.trim();
    } catch (error) {
        return "Sorry, I'm having trouble connecting to the assistant service right now.";
    }
}

function addMessage(text, cls, journey) {
    const msgDiv = document.createElement('div');
    msgDiv.className = cls;
    msgDiv.textContent = text;

    // If a journey is provided, add a clickable button
    if (journey) {
        const btn = document.createElement('button');
        btn.className = 'chatbot-journey-btn';
        btn.textContent = `Go to ${journey}`;
        btn.style.marginLeft = '1rem';
        btn.onclick = function() {
            if (journey === 'Manage Cover') {
                window.location.href = 'manage-cover.html';
            } else if (journey === 'Transfer') {
                window.location.href = 'transfer-cover.html';
            } else if (journey === 'Life Events') {
                window.location.href = 'life-events.html';
            }
        };
        //msgDiv.appendChild(btn);
    }

    document.getElementById('chatbot-messages').appendChild(msgDiv);
    document.getElementById('chatbot-messages').scrollTop = document.getElementById('chatbot-messages').scrollHeight;
}

document.addEventListener('DOMContentLoaded', function() {
    // Chatbot minimize/maximize logic
    const popup = document.getElementById('chatbot-popup');
    const toggleBtn = document.getElementById('chatbot-toggle');
    const toggleIcon = document.getElementById('chatbot-toggle-icon');
    if (popup && toggleBtn && toggleIcon) {
        let minimized = false;
        toggleBtn.addEventListener('click', function() {
            minimized = !minimized;
            if (minimized) {
                popup.style.height = '48px';
                popup.style.overflow = 'hidden';
                toggleIcon.classList.remove('fa-window-minimize');
                toggleIcon.classList.add('fa-window-maximize');
                toggleBtn.title = "Maximize";
            } else {
                popup.style.height = '';
                popup.style.overflow = '';
                toggleIcon.classList.remove('fa-window-maximize');
                toggleIcon.classList.add('fa-window-minimize');
                toggleBtn.title = "Minimize";
            }
        });
    }

    const chooseJourneyBtn = document.getElementById('choose-journey-btn');
    const findNeedBtn = document.getElementById('find-need-btn');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotForm = document.getElementById('chatbot-form');

    if (chooseJourneyBtn) {
        chooseJourneyBtn.onclick = function() {
            chatbotInput.focus();
            chatbotInput.value = "I want to choose a journey";
            chatbotForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        };
    }
    if (findNeedBtn) {
        findNeedBtn.onclick = function() {
            window.open("https://insurancecalculators.tal.com.au/awaresuper", "_blank");
        };
    }
});