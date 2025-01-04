import { useState, useRef, useEffect } from 'react';
import '../styles/Chatbot.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const chatWindowRef = useRef(null);

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        const newMessage = { role: "user", content: userInput };
        setMessages((prev) => [...prev, newMessage]);
        setUserInput('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userInput }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            const botMessage = { role: "bot", content: data.fulfillmentText };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Error during API call:', error);
        } finally {
            setIsTyping(false);
        }
    };

    useEffect(() => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    return (
        <>
            {isOpen && (
                <div className={`chatbot ${isDarkMode ? 'dark-mode' : ''}`}>
                    <div className="chat-header">
                        <span>Support</span>
                        <button className="theme-toggle" onClick={toggleTheme}>
                            {isDarkMode ? '☀️' : '🌙'}
                        </button>
                        <button className="close-button" onClick={() => setIsOpen(false)}>✖</button>
                    </div>
                    <div className="chat-window" ref={chatWindowRef}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`chat-message ${msg.role === 'bot' ? 'bot' : 'user'}`}
                            >
                                {msg.content}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        )}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            )}
            <div className="chatbot-icon" onClick={() => setIsOpen((prev) => !prev)}>
                💬
            </div>
        </>
    );
};

export default Chatbot;
