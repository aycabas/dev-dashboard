import { openAIModel } from "../models/openAIModel";
import { Configuration, OpenAIApi } from "openai";

export async function askOpenAI(prompt: string): Promise<openAIModel[]> {
    const configuration = new Configuration({
        //Insert Open AI API Key
        apiKey: "OPEN-API-KEY",

    });
    const openai = new OpenAIApi(configuration);

    try {
        const response = await openai.createCompletion({
            model: "code-davinci-002",
            prompt: prompt,
            max_tokens: 300,
            temperature: 0,
            top_p: 1,
        });
        const result: openAIModel[] = [];
        for (const obj of response.data.choices) {
            result.push(...splitText(obj["text"]!));
        }

        return result;
    } catch (e) {
        throw e;
    }
}

function splitText(text: string): openAIModel[] {
    const result: openAIModel[] = [];
    let index = 0;
    while (index < text.length) {
        // split <code></code> from text in cycles
        const codeStart = text.indexOf("<code>", index);
        const codeEnd = text.indexOf("</code>", index);
        if (codeStart === -1 || codeEnd === -1) {
            // no more code blocks
            break;
        }
        const textModel: openAIModel = {
            text: text.substring(index, codeStart),
            isCode: false,
        };
        result.push(textModel);

        const code = text.substring(codeStart + 6, codeEnd);
        const codeModel: openAIModel = {
            text: code,
            isCode: true,
        };
        result.push(codeModel);
        index = codeEnd + 7;
    }
    return result;
}
