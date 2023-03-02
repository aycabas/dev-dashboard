import { openAIModel } from "../models/openAIModel";
import * as configs from "../configs";

export async function askOpenAI(prompt: string): Promise<openAIModel[]> {

    const api_key = configs.OPENAI_API_KEY;
    const base_url = "https://" + configs.OPENAI_ENDPOINT_NAME + ".openai.azure.com";
    const deployment_name = "code-davinci-002";
    const url = base_url + "/openai/deployments/" + deployment_name + "/completions?api-version=2022-12-01";
    const payload = {
        "prompt": prompt,
        "max_tokens": 300,
        "temperature": 0,
        "top_p": 1,
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "api-key": api_key,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const res = await response.json();
        const result: openAIModel[] = [];
        for (const obj of res.choices) {
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
