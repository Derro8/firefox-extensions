/*
Prevents your history from being saved to any crunchyroll server,
instead it saves it to your browser.
*/

// console.log(storage)

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let dec = new TextDecoder();
    let enc = new TextEncoder();

    var str = "";
    filter.ondata = event => {
      storage.get(storage.currentUser, "history", (history) => {
        let data = {
          total: 0,
          data: [],
          meta: {}
        }

        if(history === undefined || history.items == undefined){
          filter.disconnect();
          return;
          // storage.set(storage.currentUser, "history", {})
          // retur
          // history = {};
        }

        history.items.reverse()

        data.total = history.items.length;
        for(let i = 0; i < history.items.length; i++) {
          let hitem = history.items[i];

          data.data.push({
            playhead: hitem.playhead,
            fully_watched: hitem.panel.episode_metadata.duration_ms / 1000 <= hitem.playhead,
            new: false,
            panel: hitem.panel
          })
        }
        str = JSON.stringify(data)

        filter.write(
          enc.encode(str)
        );

        filter.disconnect();
      })
    }
    return {}
  },
  {urls: ["https://www.crunchyroll.com/content/v2/discover/*/history?locale=*&n=*&ratings=*"]},
  ["blocking"]
);

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let enc = new TextEncoder();
    var str = "";

    let data = {
      total: 0,
      data: [],
      meta: {}
    }

    filter.ondata = event => {
      storage.get(storage.currentUser, "history", (history) => {
        if(data.total !== 0)
          return

        if(history === undefined || history.items === undefined){
          filter.disconnect();
          return
        }
        history.items.reverse()

        data.total = history.items.length;
        for(let i = 0; i < history.items.length; i++) {
          let hitem = history.items[i];

          data.data.push({
            playhead: hitem.playhead,
            fully_watched: hitem.panel.episode_metadata.duration_ms / 1000 <= hitem.playhead,
            date_played: "2023-06-28T01:16:44Z",
            new: false,
            parent_id: hitem.panel.episode_metadata.duration_ms,
            parent_type: "series",
            id: hitem.content_id,
            panel: hitem.panel
          })
        }
      })
      filter.onstop = () => {
        console.log(data)

        str = JSON.stringify(data)

        filter.write(
          enc.encode(str)
        );

        tabExec("");

        filter.disconnect();
        // tabExec("");
      }
    }
    return {}
  },
  {urls: ["https://www.crunchyroll.com/content/v2/*/watch-history?page_size=*"]},
  ["blocking"]
);

browser.webRequest.onBeforeRequest.addListener(
    (details) => {
        if(details.method === "POST") {
            storage.get(storage.currentUser, "history", (history, _item) => {
              var postJS = JSON.parse(decodeURIComponent(String.fromCharCode.apply(null,
                new Uint8Array(details.requestBody.raw[0].bytes))));

              if(history === undefined || history.items === undefined){
                // storage.set(storage.currentUser, "history", {})
                history = {items: []};
                // return
              }

              // console.log(history)
  
              let found = false;
              for(const item of history.items) {
                if(item.content_id == postJS.content_id) {
                    item.playhead = postJS.playhead;
                    found = true;
                    break;
                }
              }

              if(found === false){
                let xml = new XMLHttpRequest();

                xml.addEventListener("load", () => {
                  let panel = JSON.parse(xml.responseText).data[0];

                  postJS.panel = panel;

                  history.items.push(postJS);
                  storage.set(storage.currentUser, "history", history);
                })

                browser.storage.local.get("token").then((item) => {
                  xml.open("GET", "https://www.crunchyroll.com/content/v2/cms/objects/" + postJS.content_id + "?ratings=true&locale=en-US");
                  xml.setRequestHeader("Authorization", "Bearer " + item.token);
                  xml.send();
                })
              }
          })
          return {cancel: true}
        }
    },
    {urls:["https://www.crunchyroll.com/content/v2/*/playheads?preferred_audio_language=*&locale=*"]},
    ["blocking","requestBody"]
)

browser.webRequest.onBeforeRequest.addListener(
    (details) => {
        let filter = browser.webRequest.filterResponseData(details.requestId);
        let decoder = new TextDecoder("utf-8");
        let encoder = new TextEncoder();
        filter.ondata = event => {
          var str = decoder.decode(event.data, {stream: true});
          storage.get(storage.currentUser, "history", (history) => {
            if(history === undefined) {
              filter.write(encoder.encode(str));
              filter.disconnect();
              return;
            }

            history.items.reverse()

            for(let item in history.items) {
              item = history.items[item];
              if(item.content_id == details.url.split("content_ids=")[1].split("&")[0]) {
                let data = {
                    total: 1,
                    data: [
                        {
                            "playhead": item.playhead,
                            "content_id": item.content_id,
                            "fully_watched": false,
                            "last_modified": "2023-06-23T20:54:00Z"
                        }
                    ],
                    meta: {}
                }
                
                str = JSON.stringify(data);

                filter.write(encoder.encode(str));
                filter.disconnect();
                break
              }
            }
          })
        }
      
        return {};
      },
    {urls: ["https://www.crunchyroll.com/content/v2/*/playheads?content_ids=*&locale=*"]},
    ["blocking"]
);

browser.webRequest.onBeforeRequest.addListener(
  (details) => {
      let id = details.url.split("watch-history/")[1].split("?")[0];
      if(details.method === "DELETE") {
        storage.get(storage.currentUser, "history", (history) => {
          if(history === undefined) {
            return;
          }

          history.items.reverse();

          for(const i in history.items) {
            let item = history.items[i];
            if(item.content_id == id) {
              history.items.pop(id);
            }
          }
          storage.set(storage.currentUser, "history", history);
          tabExec("");
        })
      }
      return {cancel: true};
    },
  {urls: ["https://www.crunchyroll.com/content/v2/*/watch-history/*?preferred_audio_language=*&locale=*"]},
  ["blocking"]
);