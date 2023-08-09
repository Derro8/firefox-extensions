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

request.block([URLS.profile], "PATCH", (info) => {
  storage.get(storage.currentUser, "profile", (profile) => {
    let data = info.body;

    for(let key of Object.keys(data)){
      profile[key] = data[key];
    }

    storage.set(storage.currentUser, "profile", profile);
    tabExec("window.location.reload();");
  })
})

request.override([URLS.profile], "GET", async (info) => {
  
  return storage.getUsers((profiles) => {
    // browser.windows.create({url: browser.extension.getURL("/src/page/profiles.html")});
    storage.currentUser = profiles.current
    return storage.get(storage.currentUser, "profile", (profile) => {
      if(profile === undefined) {
        storage.set(storage.currentUser, "profile", profile);
        return info.body;
      }
      
      return JSON.stringify(profile);
    })
  })
})
