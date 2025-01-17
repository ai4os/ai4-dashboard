export interface ChatRequest {
    model: 'ai4eoscassistant';
    messages: ChatMessage[];
}

export interface ChatMessage {
    role: string;
    content: string;
}

export interface ChatResponse {
    id: string;
    choices: Choice[];
}

export interface Choice {
    index: number;
    message: ChatMessage;
    finish_reason: string;
    stop_reason: string | null;
}
