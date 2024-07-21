import { Context } from "./Types";

const defaultEventDuration = {
    SECONDS_TOAST: 5,
    MS_FADE_OUT: 500,
    MS_VERTICAL_SLIDE: 200,
};

const defaultContext: Context = {
    session_status: "initializing",
    genius_token: "",
    stats: {
        dateFirstOperation: "",
        dateLastOperation: "",
        artworkGenerations: 0,
        lyricsFetches: 0,
    },
};

const paths = {
    home: "/",
    redirect: "/redirect",
    artworkGeneration: "/artwork-generation",
    lyrics: "/lyrics",
};

export { defaultContext, defaultEventDuration, paths };
