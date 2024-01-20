import {writable } from "svelte/store";
import type { ChatType } from "../types"

export let emptyChat: ChatType = {
    id: 0,
    name: "",
    model: "",
    messages: [],
}

export let currentChatStore = writable<ChatType>(emptyChat)
export let currentResponseStore = writable<{
    loading: boolean,
    stream: string
}>({
    loading: false,
    stream: ""
})
