import ollamaAPI from "./api"
import type { MessageType } from "./types";
import { currentResponseStore } from "./stores/messages";

async function chatWithModel(data: { model: string, messages: MessageType[] }): Promise<MessageType> {
    // const response = await ollamaAPI.chat(data);
    const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        body: JSON.stringify(data)
    })

    // console.log(response);

    currentResponseStore.update(value => {
        return {
            loading: true,
            stream: ""
        }
    })

    const reader = response.body?.getReader()
    if (!reader) {
        throw new Error("Failed to read response body")
    }
    let content = ""
    while (true) {
        const { done, value } = await reader.read()
        if (done) {
            currentResponseStore.update(value => {
                return {
                    loading: false,
                    stream: value.stream
                }
            })

            break;
        }
        const rawjson = new TextDecoder().decode(value);
        const json = JSON.parse(rawjson)

        if (json.done === false) {
            // console.log(json.message.content);
            currentResponseStore.update(value => {
                return {
                    loading: true,
                    stream: value.stream + json.message.content
                }
            })
        }
    }

    let currentResponse: string = '';
    const unsubscribe = currentResponseStore.subscribe(store => currentResponse = store.stream);
    unsubscribe();

    return { role: "assistant", content: currentResponse };
}

export async function generateChatName(data: {model: string, prompt: string}) {
    const response = await self.fetch("http://localhost:11434/api/generate", {
        method: "POST",
        body: JSON.stringify({
            model: data.model,
            prompt: `Give the topic in 2 WORD of the text below. Does not say "The subject of this text is...", nor "The text mentions...", nor "The topic of this text is...". Give only the topic. \n """${data.prompt}"""`,
            stream: false
        }),
    })

    return response.json()
}

export default chatWithModel;