const URLS = {
    token: "https://www.crunchyroll.com/auth/v1/token",
    profile: "https://www.crunchyroll.com/accounts/v1/me/profile",
    watchlist: {
        save: "https://www.crunchyroll.com/content/v2/*/watchlist?preferred_audio_language=*&locale=*",
        check_exist: "https://www.crunchyroll.com/content/v2/*/watchlist?preferred_audio_language=*&locale=*",
        history: "https://www.crunchyroll.com/content/v2/discover/*/watchlist?order=*&n=*",
        watchlist: "https://www.crunchyroll.com/content/v2/discover/*/watchlist?locale=*&n=*"
    },
    history: {
        delete: "https://www.crunchyroll.com/content/v2/*/watch-history*",
        playheads: "https://www.crunchyroll.com/content/v2/*/playheads?content_ids=*&locale=*",
        save_playhead: "https://www.crunchyroll.com/content/v2/*/playheads?preferred_audio_language=*&locale=*",
        watch_history: "https://www.crunchyroll.com/content/v2/*/watch-history?*",
        continue_watching: "https://www.crunchyroll.com/content/v2/discover/*/history?locale=*&n=*&ratings=*"
    }
};