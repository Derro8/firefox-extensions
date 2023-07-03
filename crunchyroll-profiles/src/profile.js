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

request.block(["https://www.crunchyroll.com/accounts/v1/me/profile"], "PATCH", (info) => {
  storage.get(storage.currentUser, "profile", (profile) => {
    let data = info.body;

    for(let key of Object.keys(data)){
      profile[key] = data[key]
    }

    storage.set(storage.currentUser, "profile", profile)
    tabExec("window.location.reload();")
  })
})

request.override(["https://www.crunchyroll.com/accounts/v1/me/profile"], "GET", async (info) => {
  return storage.getUsers((profiles) => {
    storage.currentUser = profiles.current
    return storage.get(storage.currentUser, "profile", (profile) => {
      if(profile === undefined) {
        storage.set(storage.currentUser, "profile", JSON.parse(info.body));
        return info.body;
      }
      
      return JSON.stringify(profile)
    })
  })
})