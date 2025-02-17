export async function sendMessageToChatbot(message: string): Promise<string> {
  try {
    const response = await fetch('/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return typeof data.reply === 'string' ? data.reply : 'Error: No response received';
  } catch (error) {
    console.error('Chatbot API Error:', error);
    return 'I am currently unavailable. Please try again later.';
  }
}
