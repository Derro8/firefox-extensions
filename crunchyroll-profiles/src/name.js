/*
This script will allow you to change your username.
By clicking your username in the settings tab you can edit it.
To save your username just press enter.
*/

var isTyping = false;
var username = undefined;

// console.log(storage)

setInterval(() => {
    username = document.querySelector(".username");
    if(username === undefined)
        return
    username.onclick = () => {
        isTyping = true;
        username.innerText = "";
    }
})

window.addEventListener("keydown", (event) => {
    if(!isTyping)
        return;
    
    if(event.code == "Backspace") {
        username.innerText = username.innerText.substring(0, username.innerText.length - 1);
        return
    }
    
    if(event.code === "Enter") {
        isTyping = false;
        // storage.set()
        // storage.get
        // browser.storage.sync.get("profile").then((item) => {
        //     let js = JSON.parse(item.profile);
            
        //     js.username = username.innerText;
    
        //     browser.storage.sync.set({
        //         profile: JSON.stringify(js)
        //     });
        // })
        return;
    }

    if(event.key.length == 1)
        username.innerText += event.key;
})