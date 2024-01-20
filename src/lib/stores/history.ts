import { writable } from "svelte/store";
import type { ChatType } from "../types";

export let historyStore = writable<ChatType[]>([])
