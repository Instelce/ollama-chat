export type MessageType = {
    role: "assistant" | "user" | "system";
    content: string;
}

export type ModelType = {
    name: string;
    modified_at: Date;
    size: number;
    digest: string;
    details: {
        format: string;
        family: string;
        families: string[] | null,
        parameter_size: string;
        quantization_level: string;
    }
}

// Conversation
export type ChatType = {
    id: number;
    name: string;
    model: string;
    messages: MessageType[];
    // date: Date;
}