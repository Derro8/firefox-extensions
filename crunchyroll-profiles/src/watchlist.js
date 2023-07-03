/*
 Saves the watchlist.
*/

request.block(["https://www.crunchyroll.com/content/v2/*/watchlist?preferred_audio_language=*&locale=*"], "POST", (info) => {
    storage.get(storage.currentUser, "watchlist", (watchlist) => {
        let toggle = false;
        if(watchlist === undefined) {
            tabExec('document.body.querySelector(".watchlist-toggle--LJPTQ").classList.add("watchlist-toggle--is-active--eu81r")')
            let watchlist = {items: []}

            crunchyroll.send({
                url: "https://www.crunchyroll.com/content/v2/discover/up_next/" + info.body.content_id +"?preferred_audio_language=ja-JP&locale=en-US",
                method: "GET"
            }, (xml) => {
                let data = JSON.parse(xml.responseText).data[0];

                info.body.panel = data.panel;
                info.body.playhead = data.playhead;
                info.body.never_watched = data.never_watched;
                info.body.fully_watched = data.fully_watched
                info.body.is_favorite = false;

                watchlist.items.push(info.body)
                storage.set(storage.currentUser, "watchlist", watchlist);
            })

            return;
        }

        let count = -1;
        for(const item of watchlist.items) {
            if(item.content_id == info.body.content_id) {
                toggle = true;
                count++;
                break;
            }
        }

        if(toggle === true) {
            tabExec('document.body.querySelector(".watchlist-toggle--LJPTQ").classList.remove("watchlist-toggle--is-active--eu81r")')
            watchlist.items.pop(count);
        } else {
            tabExec('document.body.querySelector(".watchlist-toggle--LJPTQ").classList.add("watchlist-toggle--is-active--eu81r")')
            crunchyroll.send({
                url: "https://www.crunchyroll.com/content/v2/discover/up_next/" + info.body.content_id +"?preferred_audio_language=ja-JP&locale=en-US",
                method: "GET"
            }, (xml) => {
                let data = JSON.parse(xml.responseText).data[0];

                info.body.panel = data.panel;
                info.body.playhead = data.playhead;
                info.body.never_watched = data.never_watched;
                info.body.fully_watched = data.fully_watched
                info.body.is_favorite = false;

                watchlist.items.push(info.body)
                storage.set(storage.currentUser, "watchlist", watchlist);
            })
        }
    })
})

request.block(["https://www.crunchyroll.com/content/v2/*/watchlist?content_ids=*&locale=*"], ["GET", "DELETE"], (info) => {
    storage.get(storage.currentUser, "watchlist", (watchlist) => {
        if(watchlist === undefined)
            return;
        let id = info.details.url.split("content_ids=")[1].split("&")[0];
        for(const item of watchlist.items) {
            if(item.content_id == id) {
                tabExec(`
                (function(selector) {
                    return new Promise(resolve => {
                        if (document.querySelector(selector)) {
                            return resolve(document.querySelector(selector));
                        }
                
                        const observer = new MutationObserver(mutations => {
                            if (document.querySelector(selector)) {
                                resolve(document.querySelector(selector));
                                observer.disconnect();
                            }
                        });
                
                        observer.observe(document.body, {
                            childList: true,
                            subtree: true
                        });
                    });
                })(".watchlist-toggle--LJPTQ").then((elm) => {
                    if(elm.classList.indexOf("watchlist-toggle--is-active--eu81r") === -1)
                        elm.classList.add("watchlist-toggle--is-active--eu81r")
                    if(elm.classList.indexOf("watchlist-toggle--is-active--eu81r") > -1)
                        elm.classList.remove("watchlist-toggle--is-active--eu81r")
                })
                `);
                break;
            }
        }
    })
})

request.override(["https://www.crunchyroll.com/content/v2/discover/*/watchlist?locale=*&n=*"], "GET", async (info) => {
    return storage.get(storage.currentUser, "watchlist", (watchlist) => {
        let data = {
            total: 0,
            data: [],
            meta: {
                total_before_filter: 0
            }
        };

        if(watchlist){
            watchlist.items.reverse();
            for(let i = 0; i < watchlist.items.length; i++) {
                let item = watchlist.items[i];

                data.data.push({
                    playhead: item.playhead,
                    fully_watched: item.fully_watched,
                    new: false,
                    is_favorite: item.is_favorite,
                    never_watched: item.never_watched,
                    panel: item.panel
                })
            }
            data.total = data.data.length;
            data.meta.total_before_filter = data.data.length;
            return JSON.stringify(data)
        }
    })
})

request.block(["https://www.crunchyroll.com/content/v2/*/watchlist/*?preferred_audio_language=*&locale=*"], ["DELETE", "PATCH"], (info) => {
    storage.get(storage.currentUser, "watchlist", (watchlist) => {
        let id = info.details.url.split("?")[0].split("").reverse().join("").split("/")[0].split("").reverse().join("");

        if(info.details.method === "DELETE") {
            for(let i = 0; i < watchlist.items.length; i++) {
                if(watchlist.items[i].content_id == id) {
                    watchlist.items.pop(i);
                    break;
                }
            }
        }

        if(info.details.method === "PATCH") {
            for(let i = 0; i < watchlist.items.length; i++) {
                if(watchlist.items[i].content_id == id) {
                    for(let key of Object.keys(info.body)){
                        watchlist.items[i][key] = info.body[key]
                    }
                    break;
                }
            }
        }

        storage.set(storage.currentUser, "watchlist", watchlist)

        tabExec("");
    })
})

request.override(["https://www.crunchyroll.com/content/v2/discover/*/watchlist?order=*&n=*"], "GET", async (info) => {
    // for some reason this link broke for me even when I don't have the extension installed, so if this doesn't work rip.
    return storage.get(storage.currentUser, "watchlist", (watchlist) => {
        let data = {
            total: 0,
            data: [],
            meta: {
                total_before_filter: 0
            }
        };

        if(watchlist === undefined)
            return JSON.stringify(data);

        watchlist.items.reverse();

        for(let i = 0; i < watchlist.items.length; i++) {
            let item = watchlist.items[i];

            data.data.push({
                playhead: item.playhead,
                fully_watched: item.fully_watched,
                new: false,
                is_favorite: item.is_favorite,
                never_watched: item.never_watched,
                panel: item.panel
            })
        }

        data.total = data.data.length;
        data.meta.total_before_filter = data.data.length;
        
        return JSON.stringify(data)
    })
})