import axios from "axios";
import type { MessageType } from "./types";

const ollamaAxios = axios.create({
    baseURL: 'http://localhost:11434'
})

const ollamaAPI = {
    chat: (data: {model: string, messages: MessageType[]}) => ollamaAxios.post("/api/chat", JSON.stringify(data)).then(r => r.data),
    models: {
        list: async () => await ollamaAxios.get("/api/tags").then(r => {
            return r.data
        }),
    }
}

export default ollamaAPI;