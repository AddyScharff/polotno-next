'use server';

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});


export async function modifyJsonData(template: any, inputParams: any): Promise<any> {

    const prompt = {
        role: "user" as "user",
        content: `
        You are a JSON formatting assistant
        Merge this template: ${JSON.stringify(template)}
        With this input data: ${JSON.stringify(inputParams)}
        Return ONLY valid JSON without any additional text or formatting.`
    };

    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 4096,
            messages: [prompt],
        });

        // Extract the first content block and parse it
        const content = msg.content[0];
        console.log("Content:", content);
        if (content.type === 'text') {
            return JSON.parse(content.text);
        } else {
            throw new Error('Unexpected content type');
        }
    } catch (error) {
        console.error("An error occurred:", error);
        throw error;
    }
}