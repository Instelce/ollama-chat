import {writable } from "svelte/store";
import type { MessageType } from "./types"

export let messagesStore = writable<MessageType[]>([])
export let currentResponseStore = writable<{
    loading: boolean,
    stream: string
}>({
    loading: false,
    stream: ""
})
