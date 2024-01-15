export type Message = {
    role: "assistant" | "user" | "system";
    content: string;
}