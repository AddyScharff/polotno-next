import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY || 'sk-sk-c78c527f7f47479ebc8dbb064d1b0125', // Avoid hardcoding in production
    dangerouslyAllowBrowser: true, // Only for testing; avoid in production
});

export async function modifyJsonData(template: any, inputParams: any): Promise<any> {
    console.log("Function called with template:", template, "and inputParams:", inputParams);

    const system_prompt = `
        You are a JSON formatting assistant. 
        Merge this template: ${JSON.stringify(template)}
        With this input data: ${JSON.stringify(inputParams)}
        Return ONLY valid JSON without any additional text or formatting.`;

    try {
        const response = await openai.chat.completions.create({
            model: "deepseek-chat",
            messages: [
                { role: "system", content: system_prompt },
                { role: "user", content: "Return the merged JSON." }
            ],
        });

        // Check for empty response
        if (!response.choices?.[0]?.message?.content) {
            throw new Error("API returned empty content");
        }

        const rawContent = response.choices[0].message.content;
        console.log("Raw API response:", rawContent); // Debugging line

        // Clean Markdown formatting
        const jsonString = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();

        // Parse JSON
        try {
            const parsedJson = JSON.parse(jsonString);
            return parsedJson;
        } catch (parseError) {
            console.error("JSON parse error. Content:", jsonString);
            throw new Error("Invalid JSON format from API");
        }

    } catch (error) {
        // Log the full error details
        const typedError = error as any;
        console.error("Full error details:", {
            message: typedError.message, // Error message
            stack: typedError.stack,    // Stack trace
            name: typedError.name,      // Error type
            response: typedError.response?.data, // API response (if available)
            status: typedError.response?.status, // HTTP status code (if available)
        });
        throw new Error("Failed to modify JSON data");
    }
}