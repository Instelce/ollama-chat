export type MessageType = {
    role: "assistant" | "user" | "system";
    content: string;
}

export type Model = {
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
