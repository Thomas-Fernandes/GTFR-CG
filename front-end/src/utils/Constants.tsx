import { Context } from "./Types";

const defaultEventDuration = {
    SECONDS_TOAST: 5,
    MS_FADE_OUT: 500,
    MS_VERTICAL_SLIDE: 200,
};

const paths = {
    home: "/",
    redirect: "/redirect",
    artworkGeneration: "/artwork-generation",
    lyrics: "/lyrics",
};

const defaultContext: Context = {
    // Home
    session_status: "initializing",
    genius_token: "",
    stats: {
        dateFirstOperation: "",
        dateLastOperation: "",
        artworkGenerations: 0,
        lyricsFetches: 0,
    },

    // Redirect
    error_text: "",
    redirect_to: paths.home,
    plural: "s",
};

export { defaultContext, defaultEventDuration, paths };
