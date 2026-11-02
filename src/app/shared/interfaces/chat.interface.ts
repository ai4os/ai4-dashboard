export interface ChatRequest {
    model: 'ai4eoscassistant';
    messages: ChatMessage[];
}

export interface ChatMessage {
    role: string;
    content: string;
}
