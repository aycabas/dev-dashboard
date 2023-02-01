import { openAIModel } from "../models/openAIModel";
import { Configuration, OpenAIApi } from "openai";

export async function askOpenAI(prompt: string): Promise<openAIModel[]> {
    const configuration = new Configuration({
        //Insert Open AI API Key
        apiKey: "",

    });
    const openai = new OpenAIApi(configuration);

    try {
        const response = await openai.createCompletion({
            model: "code-davinci-002",
            prompt: prompt,
            max_tokens: 300,
            temperature: 0,
            top_p: 1
        });
        const result: openAIModel[] = [];
        for (const obj of response.data.choices) {
            const tmp: openAIModel = {
                text: obj["text"],
            };

            result.push(tmp);

        }

        return result;
    } catch (e) {
        throw e;
    }
}

