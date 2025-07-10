import { LlmConfiguration } from '@app/shared/interfaces/module.interface';

export const llmDefaultFormValues: LlmConfiguration = {
    type: {
        name: 'Deployment type',
        value: 'both',
        description: 'Sub-components to deploy.',
        options: ['both', 'vllm', 'open-webui'],
    },
    vllm_model_id: {
        name: 'LLM modelname',
        value: 'Qwen2.5-7B-Instruct-AWQ',
        description: 'Large Language Model to use (retrieve from Huggingface).',
        options: [],
        range: [],
    },
    ui_username: {
        name: 'Open WebUI username',
        value: '',
        description: 'Admin username for Open WebUI',
    },
    ui_password: {
        name: 'Open WebUI password',
        value: '',
        description: 'Admin password for Open WebUI',
    },
    HF_token: {
        name: 'Huggingface token',
        value: '',
        description: 'Needed for the deployment of some gated models.',
    },
    openai_api_key: {
        name: 'OpenAI API key',
        value: '',
        description: 'Needed when deploying Open WebUI as standalone.',
    },
    openai_api_url: {
        name: 'OpenAI API base url',
        value: '',
        description: 'Needed when deploying Open WebUI as standalone.',
    },
};
