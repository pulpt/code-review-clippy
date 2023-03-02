/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';

export interface ClippyOpts {
    apiKey: string;
    model: string;
    maxTokens: number;
    codeToReview: string;
    isModelChatGPT: boolean;
}

const PROMPT_PREFIX = 'Write code review for the following code, be as sarcastic and passive-aggressive you can: ';
const COMPLETIONS_ENDPOINT = 'https://api.openai.com/v1/completions';

const CHAT_GPT_PROMPT_PREFIX = 'You are sarcastic and passive aggressive bot who reviews code';
const CHAT_GPT_COMPLETIONS_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

const settings = {
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
};

export const getReviewForCode = async (opts: ClippyOpts) => {
    const { apiKey, maxTokens, codeToReview, model, isModelChatGPT } = opts;

    const client = axios.create({
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        }
    });

    const formattedCodeToReview = generateBodyBasedOnModel(codeToReview, isModelChatGPT);
    const body = {
        ...settings,
        ...formattedCodeToReview,
        model,
        max_tokens: maxTokens,
    };

    const endpoint = isModelChatGPT
        ? CHAT_GPT_COMPLETIONS_ENDPOINT
        : COMPLETIONS_ENDPOINT;

    return client.post(endpoint, body);
};

function generateBodyBasedOnModel(codeToReview: string, isModelChatGPT: boolean) {
    if (!isModelChatGPT) {
        return {
            prompt: `${PROMPT_PREFIX} ${codeToReview}`
        };
    }

    return {
        messages: [
            { "role": "system", "content": CHAT_GPT_PROMPT_PREFIX },
            { "role": "user", "content": codeToReview }
        ]
    };
}
