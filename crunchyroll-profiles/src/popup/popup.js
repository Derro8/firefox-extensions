var current_profile = undefined
var isTyping = false;

document.body.querySelector(".username").onclick = () => {
    isTyping = true;
    document.body.querySelector(".username").innerText = "";
}

window.addEventListener("keydown", (event) => {
    if(!isTyping)
        return;
    
    if(event.code == "Backspace") {
        document.body.querySelector(".username").innerText = document.body.querySelector(".username").innerText.substring(0, document.body.querySelector(".username").innerText.length - 1);
        return
    }
    
    if(event.code === "Enter") {
        isTyping = false;
        storage.get(storage.currentUser, "profile", (profile => {
            profile.username = document.querySelector(".username").innerText;
            storage.set(storage.currentUser, "profile", profile)
        }))
        return;
    }

    if(event.key.length == 1)
        document.body.querySelector(".username").innerText += event.key;
})


function loadAvatar() {
    storage.getUsers((profiles) => {
        storage.currentUser = profiles.current;
        storage.get(profiles.current, "profile", (profile) => {
            document.body.querySelector(".avatar").src = profile !== undefined && "https://static.crunchyroll.com/assets/avatar/170x170/" + profile.avatar || "https://static.crunchyroll.com/assets/avatar/170x170/0001-cr-white-orange.png";
            document.body.querySelector(".username").innerText = profile !== undefined && profile.username || "Profile" + profiles.current.toString();
            document.body.querySelector(".wallpaper").src = profile !== undefined && profile.wallpaper !== undefined && "https://static.crunchyroll.com/assets/wallpaper/720x180/" + profile.wallpaper || "https://static.crunchyroll.com/assets/wallpaper/720x180/01-crunchyroll-generic-hime.png";
        })
    })
}

loadAvatar();

function addAvatar(){
    storage.getUsers((profiles) => {
        profiles.current++;
        profiles.others[profiles.current.toString()] = profiles.current;

        browser.storage.local.set({profiles: profiles})
        loadAvatar();
    })
}


document.body.querySelector(".left").addEventListener("click", () => {
    storage.getUsers((profiles) => {
        if(profiles.others.length > 1 & profiles.current - 1 >= 0) {
            profiles.current--;
            browser.storage.local.set({profiles: profiles})
            loadAvatar();
        }
    })
});
document.body.querySelector(".right").addEventListener("click", () => {
    storage.getUsers((profiles) => {
        if(profiles.others.length > 1 & profiles.current < profiles.others.length - 1) {
            profiles.current++;
            browser.storage.local.set({profiles: profiles})
            loadAvatar();
        }
    })
});

document.body.querySelector(".add").onclick = addAvatar;