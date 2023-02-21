/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';

export interface ClippyOpts {
    apiKey: string;
    model: string;
    maxTokens: number;
    codeToReview: string;
}

const PROMPT_PREFIX = "Write code review for the following code, be as sarcastic and passive-aggressive you can: ";
const COMPLETIONS_ENDPOINT = 'https://api.openai.com/v1/completions';

const settings = {
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
};

export const getReviewForCode = async (opts: ClippyOpts) => {
    const { apiKey, maxTokens, codeToReview, model } = opts;
    const client = axios.create({
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        }
    });
    const body = {
        ...settings,
        model,
        max_tokens: maxTokens,
        prompt: `${PROMPT_PREFIX} ${codeToReview}`
    };
    return client.post(COMPLETIONS_ENDPOINT, body);
};
