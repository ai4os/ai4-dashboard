export interface SelfLllmSummary {
    id: string;
    name: string;
    description: string;
    family: string;
    license: string;
    context: string;
    needs_HF_token: boolean;
    args: string[];
}

export interface PlatformLlmSummary {
    id: string;
    status: string;
    name: string;
    description: string;
    family: string;
    max_input_tokens: string;
    supports_function_calling: boolean;
    supports_reasoning: boolean;
    supports_vision: boolean;
}
