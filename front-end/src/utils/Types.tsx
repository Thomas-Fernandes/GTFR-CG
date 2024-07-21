type Statistics = {
    dateFirstOperation: string;
    dateLastOperation: string;
    artworkGenerations: number;
    lyricsFetches: number;
};

type ResponseStatus = "info" | "success" | "warning" | "error";

type Context = {
    session_status?: string;
    genius_token?: string;
    stats?: Statistics;
};

export type { Context, ResponseStatus, Statistics };
