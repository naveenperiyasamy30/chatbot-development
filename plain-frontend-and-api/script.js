
        document.addEventListener('DOMContentLoaded', () => {
            const chatWindow = document.getElementById('chat-window');
            const userInput = document.getElementById('user-input');
            const sendBtn = document.getElementById('send-btn');
            const key = "YOUR API KEY"; // <-- Paste your API key here.

            async function getBotResponse(userInput){
                try {
                    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${key}`,
                            "HTTP-Referer": "https://github.com/naveenperiyasamy30/chatbot-development",
                            "X-Title": "Compositor Instinct",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            "model": "deepseek/deepseek-r1:free",
                            "messages": [{ "role": "user", "content": userInput }]
                        })
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
                    }

                    const data = await response.json();
                    return data.choices[0].message.content;
                } catch (error) {
                    console.error("API call failed:", error);
                    return "Sorry, something went wrong. Please try again later.";
                }
            }
            
            async function sendMessage() {
                const userMessage = userInput.value.trim();
                if (userMessage === '') return;

                // Display user's message
                displayMessage(userMessage, 'user');
                userInput.value = '';

                // Reset textarea height after sending message
                userInput.style.height = 'auto';

                // Add a typing indicator
                const botTyping = displayTypingIndicator();

                // Get bot response
                const botResponse = await getBotResponse(userMessage);

                // Remove typing indicator and display bot's message
                chatWindow.removeChild(botTyping);
                displayMessage(botResponse, 'bot');
            }


           function formatBotResponse(text) {
                // ### heading -> new line + bold
                text = text.replace(/###\s*(.*)/g, "<br><b>$1</b>");
                // ***bold italic***
                text = text.replace(/\*\*\*(.*?)\*\*\*/g, "<b><i>$1</i></b>");
                // **bold**
                text = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
                // *italic*
                text = text.replace(/\*(.*?)\*/g, "<i>$1</i>");
                return text;
            }

            
            function displayMessage(text, sender) {
                const messageContainer = document.createElement('div');
                messageContainer.classList.add('flex', sender === 'user' ? 'justify-end' : 'justify-start');

                const messageDiv = document.createElement('div');
                messageDiv.classList.add('message-box', 'px-4', 'py-2', 'max-w-[80%]');
                messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
                messageDiv.textContent = text;


                   // Bot response la markdown format apply
                if (sender === 'bot') {
                    messageDiv.innerHTML = formatBotResponse(text);
                } else {
                    messageDiv.textContent = text;
                }


                messageContainer.appendChild(messageDiv);
                chatWindow.appendChild(messageContainer);
                chatWindow.scrollTop = chatWindow.scrollHeight;
            }



            function displayTypingIndicator() {
                const messageContainer = document.createElement('div');
                messageContainer.classList.add('flex', 'justify-start');

                const typingDiv = document.createElement('div');
                typingDiv.classList.add('message-box', 'bot-message', 'px-4', 'py-2', 'max-w-[80%]', 'flex', 'items-center', 'space-x-2');
                
                // Add the loader animation
                typingDiv.innerHTML = `<div class="loader"></div> <span>Fetching...</span>`;
                messageContainer.appendChild(typingDiv);
                chatWindow.appendChild(messageContainer);
                chatWindow.scrollTop = chatWindow.scrollHeight;

                return messageContainer;
            }

            // Auto-resize the textarea
            userInput.addEventListener('input', () => {
                userInput.style.height = 'auto';
                userInput.style.height = userInput.scrollHeight + 'px';
            });

            sendBtn.addEventListener('click', sendMessage);
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault(); // Prevents a new line on Enter
                    sendMessage();
                }
            });
        });