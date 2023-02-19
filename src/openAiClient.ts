/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';

const PROMPT_PREFIX = "Write code review for the following code, be as sarcastic and passive-aggressive you can: ";
const settings = {
    model: "text-davinci-003",
    temperature: 0.7,
    max_tokens: 1012,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop: ["\\n"],
};

export const getReviewForCode = async (code: string, apiKey: string) => {
    const client = axios.create({
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        }
    });
    const body = { ...settings, prompt: `${PROMPT_PREFIX} ${code}` };
    return client.post('https://api.openai.com/v1/completions', body);
};