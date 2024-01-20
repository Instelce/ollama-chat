import { writable } from "svelte/store";

export let settingsStore = writable({
    ollama: {
        host: "http://localhost:11434"
    }
})