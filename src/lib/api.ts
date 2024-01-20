import axios from "axios";
import type { MessageType } from "./types";
import { settingsStore } from "./stores/settings";

let host: string;
settingsStore.subscribe(value => host = value.ollama.host);

const ollamaAPI = {
    generateStream: async (model: string, systemPrompt: string, temperature: number, prompt: string) => {
        return await fetch(`${host}/api/chat`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
            },
            method: 'POST',
            body: JSON.stringify({
                model: model,
                prompt: prompt,
                system: systemPrompt,
                options: {
                    temperature: temperature,
                },
            }),
        });
    },
    models: {
        list: async () => fetch(`${host}/api/tags`).then(r => r.json())
    }
}

export default ollamaAPI;