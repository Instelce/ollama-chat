import {writable } from "svelte/store";
import type { Message } from "./types"

export let messagesStore = writable<Message[]>([])
export let currentResponseStore = writable<{
    loading: boolean,
    stream: string
}>({
    loading: false,
    stream: ""
})
