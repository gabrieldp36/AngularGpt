export interface Message {
    id?: number;
    text: string;
    isGpt: boolean;
    info?: {
        userScore: number;
        errors:    string[];
        message:   string;
    }
    audioUrl?: string;
}