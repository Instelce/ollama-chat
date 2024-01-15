import axios from "axios";
import type { Message } from "./types";

const ollamaAxios = axios.create({
    baseURL: 'http://localhost:11434'
})

const ollamaAPI = {
    chat: (data: {model: string, messages: Message[]}) => ollamaAxios.post("/api/chat", JSON.stringify(data)).then(r => r.data),
    models: {
        list: () => ollamaAxios.get("/api/tags").then(r => r.data),
    }
}

export default ollamaAPI;