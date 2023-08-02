const crunchyroll = {
    token: "",
    send: (info, callback) => {
        request.send(
            info,
            callback,
            (xml) => {
                xml.setRequestHeader("Authorization", "Bearer " + crunchyroll.token);
            }
        )
    }
}

browser.storage.local.get("token").then(item => {
  crunchyroll.token = item.token;  
})