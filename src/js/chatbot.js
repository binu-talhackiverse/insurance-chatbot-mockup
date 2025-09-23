let conversationHistory = [
    {
        role: "system",
        content: "You are an insurance assistant.\nYour job is to help users select the correct journey: Transfer,Manage Cover or Life Events.\nIf the user's request is unclear, ask clarifying questions to understand their intent.\nIf the user mentions multiple needs, help them prioritise or handle one at a time.\nBe concise, friendly and helpful.\nIf the user's needs match Manage Cover, do the following:\n- Ask these two eligibility questions on at a time, waiting for the user's answer before asking the next:\n1) Are you currently restricted from performing all of your normal and usual duties due to illness or injury?\n2) Have you been told by a medical practitioner that your life expectancy could be less than 24 months due to illness or injury?\n- If the answer is \"Yes\" to either, recommend the Long form. Otherwise, recommend short form.\n- Do not ask about journey selection again once the user has chosen manage Cover, unless the user changes their intent.\n- If an answer is missing, ask for it before making recommendation.\n- Do not repeat questions that have already been answered.\n- For other journeys, do not ask these eligibility questions.\nbe clear and concise"
    }
];

document.getElementById('chatbot-close').onclick = function() {
    document.getElementById('chatbot-popup').classList.add('hidden');
};

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
    addMessage(botReply, 'bot-message');

    // Add bot reply to conversation history
    conversationHistory.push({ role: "assistant", content: botReply });
};

// Modified to accept conversation history
async function getAzureAIResponse(messages) {
    const endpoint = "https://coverwise-agent-1-resource.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2025-01-01-preview";
    const apiKey = "52w2QlkgQXDsYAnzT6nc6IJpjSQeVvylVMt8pKdmO8cGKCNJ8q5aJQQJ99BIACYeBjFXJ3w3AAAAACOGr2Z1";

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

function addMessage(text, cls) {
    const msgDiv = document.createElement('div');
    msgDiv.className = cls;
    msgDiv.textContent = text;
    document.getElementById('chatbot-messages').appendChild(msgDiv);
    document.getElementById('chatbot-messages').scrollTop = document.getElementById('chatbot-messages').scrollHeight;
}