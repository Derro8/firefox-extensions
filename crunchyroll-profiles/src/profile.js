/*
This script handles profile changes, and saves the profile on first run.
*/

const removeError = `
if(document.body.querySelector(".flash-message__wrapper--UWCF8"))
  document.body.querySelector(".flash-message__wrapper--UWCF8").remove();
`

function tabExec(script) {
  browser.tabs.executeScript({
    code: removeError + script
  })
}

function SaveHandler(options, profile) {
  tabExec(`
    window.location.reload()
  `)
}


browser.webRequest.onBeforeRequest.addListener(
  (details) => {

    let decoder = new TextDecoder("utf-8");
    let encoder = new TextEncoder();

    if(details.method === "GET") {
      let filter = browser.webRequest.filterResponseData(details.requestId);
    
      filter.ondata = event => {
        storage.getUsers((profiles) => {
          storage.currentUser = profiles.current
          storage.get(storage.currentUser, "profile", (profile) => {
            var str = decoder.decode(event.data, {stream: true});
            var js  = JSON.parse(str)

            if(profile === undefined || profile === 0) {
              storage.set(storage.currentUser, "profile", js);
              filter.write(encoder.encode(JSON.stringify(js)));
              filter.disconnect();
              return;
            }

            js = profile;
            filter.write(encoder.encode(JSON.stringify(js)));
            filter.disconnect();
          })
        })
      }
    }

    if(details.method === "PATCH") {
      storage.get(storage.currentUser, "profile", (profile) => {
        let data = JSON.parse(decoder.decode(details.requestBody.raw[0].bytes));

        for(let key of Object.keys(data)){
          profile[key] = data[key]
        }

        storage.set(storage.currentUser, "profile", profile)

        SaveHandler(Object.keys(data), profile);
      })
      
      return {cancel: true};
    }
  
    return {};
  },
  {urls: ["https://www.crunchyroll.com/accounts/v1/me/profile"]},
  ["blocking", "requestBody"]
);