/*
 Saves the watchlist.
*/

browser.webRequest.onBeforeRequest.addListener(
    (details) => {
        if(details.method === "POST") {
            var postJS = JSON.parse(decodeURIComponent(String.fromCharCode.apply(null,
                new Uint8Array(details.requestBody.raw[0].bytes))));
            storage.get(storage.currentUser, "watchlist", (watchlist, _item) => {
                let toggle = false;

                if(watchlist === undefined) {
                    tabExec(`
                    document.body.querySelector(".watchlist-toggle--LJPTQ").classList.add("watchlist-toggle--is-active--eu81r")
                    `)
                    let watchlist = {items: []}
                    let xml = new XMLHttpRequest();

                    xml.addEventListener("load", () => {
                        let data = JSON.parse(xml.responseText).data[0];

                        postJS.panel = data.panel;
                        postJS.playhead = data.playhead;
                        postJS.never_watched = data.never_watched;
                        postJS.fully_watched = data.fully_watched
                        postJS.is_favorite = false;

                        watchlist.items.push(postJS)
                        storage.set(storage.currentUser, "watchlist", watchlist);
                    })

                    browser.storage.local.get("token").then((item) => {
                        xml.open("GET", "https://www.crunchyroll.com/content/v2/discover/up_next/" + postJS.content_id +"?preferred_audio_language=ja-JP&locale=en-US");
                        xml.setRequestHeader("Authorization", "Bearer " + item.token);
                        xml.send();
                    })
                    // storage.set(storage.currentUser, "watchlist", {items: [JSON.stringify(postJS)]});
                    // browser.storage.local.set({watchlist: "{\"items\": ["+JSON.stringify(postJS)+"]}"})
                    return;
                }

                let count = -1;
                for(const item of watchlist.items) {
                  if(item.content_id == postJS.content_id) {
                    toggle = true;
                    count++;
                    break;
                  }
                }

                if(toggle === true) {
                    tabExec(`
                    document.body.querySelector(".watchlist-toggle--LJPTQ").classList.remove("watchlist-toggle--is-active--eu81r")
                    `)
                    watchlist.items.pop(count);
                } else {
                    tabExec(`
                    document.body.querySelector(".watchlist-toggle--LJPTQ").classList.add("watchlist-toggle--is-active--eu81r")
                    `)
                    let xml = new XMLHttpRequest();

                    xml.addEventListener("load", () => {
                        let data = JSON.parse(xml.responseText).data[0];

                        postJS.panel = data.panel;
                        postJS.playhead = data.playhead;
                        postJS.never_watched = data.never_watched;
                        postJS.is_favorite = false;
                        postJS.fully_watched = data.fully_watched

                        watchlist.items.push(postJS)
                        _item[storage.currentUser.toString()]["watchlist"] = watchlist;
                        browser.storage.local.set({
                            [storage.currentUser.toString()]: _item[storage.currentUser.toString()]
                        })
                        // storage.set(storage.currentUser, "watchlist", watchlist);
                    })

                    browser.storage.local.get("token").then((item) => {
                        xml.open("GET", "https://www.crunchyroll.com/content/v2/discover/up_next/" + postJS.content_id +"?preferred_audio_language=ja-JP&locale=en-US");
                        xml.setRequestHeader("Authorization", "Bearer " + item.token);
                        xml.send();
                    })
                }
            // storage.set(storage.currentUser, "watchlist", watchlist);
                // browser.storage.local.set({watchlist: JSON.stringify(js)});
            })
            return {cancel: true}
        }
    },
    {urls:["https://www.crunchyroll.com/content/v2/*/watchlist?preferred_audio_language=*&locale=*"]},
    ["blocking","requestBody"]
)

browser.webRequest.onBeforeRequest.addListener(
    (details) => {
        storage.get(storage.currentUser, "watchlist", (watchlist, _item) => {
            if(watchlist !== undefined){
                let id = details.url.split("content_ids=")[1].split("&")[0];
                
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
                        elm.classList.add("watchlist-toggle--is-active--eu81r")
                    })
                    `);
                    break;
                  }
                }
            }
        })
        return {cancel: true};
    },
    {urls:["https://www.crunchyroll.com/content/v2/*/watchlist?content_ids=*&locale=*"]},
    ["blocking"]
)

browser.webRequest.onBeforeRequest.addListener(
    (details) => {
      let filter = browser.webRequest.filterResponseData(details.requestId);
      let dec = new TextDecoder();
      let enc = new TextEncoder();
      var str = "";
      
      filter.ondata = event => {
        storage.get(storage.currentUser, "watchlist", (watchlist, _item)=>{
            // storage.get(storage.currentUser, "history", (history) => {
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
                    str = JSON.stringify(data)
                    filter.write(
                        enc.encode(str)
                    );
                    filter.disconnect();
                } else {
                    filter.disconnect();
                }
            // })
        })
    }
    return {}
    },
    {urls: ["https://www.crunchyroll.com/content/v2/discover/*/watchlist?locale=*&n=*"]},
    ["blocking"]
);


browser.webRequest.onBeforeRequest.addListener(
    (details) => {
        let decoder = new TextDecoder('utf-8');

        let id = details.url.split("?")[0].split("").reverse().join("").split("/")[0].split("").reverse().join("");

        storage.get(storage.currentUser, "watchlist", (watchlist) => {
            watchlist.items.reverse();
            if(details.method === "DELETE") {
                for(let i = 0; i < watchlist.items.length; i++) {
                    if(watchlist.items[i].content_id == id) {
                        watchlist.items.pop(i);
                        break;
                    }
                }
            }

            if(details.method === "PATCH") {
                for(let i = 0; i < watchlist.items.length; i++) {
                    if(watchlist.items[i].content_id == id) {
                        let data = JSON.parse(decoder.decode(details.requestBody.raw[0].bytes));
                        console.log(data)
                        for(let key of Object.keys(data)){
                            console.log(key)
                            watchlist.items[i][key] = data[key]
                        }
                        break;
                    }
                }
            }

            console.log(watchlist)

            storage.set(storage.currentUser, "watchlist", watchlist)

            tabExec("");
        })

        // if(details.method == "DELETE")
        return {cancel: true}
    },
    {urls: ["https://www.crunchyroll.com/content/v2/*/watchlist/*?preferred_audio_language=*&locale=*"]},
    ["blocking", "requestBody"]
);

browser.webRequest.onBeforeRequest.addListener(
    (details) => {
      let filter = browser.webRequest.filterResponseData(details.requestId);
      let dec = new TextDecoder();
      let enc = new TextEncoder();
      var str = "";
      
      filter.ondata = event => {
        storage.get(storage.currentUser, "watchlist", (watchlist)=>{
            // storage.get(storage.currentUser, "history", (history) => {
                // console.log(watchlist)
                let data = {
                    total: 0,
                    data: [],
                    meta: {
                        total_before_filter: 0
                    }
                };
                if(watchlist){
                    // let watchlist = JSON.parse(item.watchlist);
                    // let history = JSON.parse(_item.history);

                    // history.items.reverse();
                    watchlist.items.reverse();
                    for(let i = 0; i < watchlist.items.length; i++) {
                        // let panel = JSON.parse(xml.responseText).data[0];
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
                    str = JSON.stringify(data)
                    filter.write(
                        enc.encode(str)
                    );
                    filter.disconnect();
                } else {
                    filter.disconnect()
                }
            // })
        })
    }
    return {}
    },
    {urls: ["https://www.crunchyroll.com/content/v2/discover/*/watchlist?order=*&n=*"]},
    ["blocking"]
);