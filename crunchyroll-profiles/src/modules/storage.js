const storage = {
    currentUser: "",
    getUsers: (callback) => {
        browser.storage.local.get("profiles").then((item) => {
            if(item.profiles === undefined) {
                item.profiles = {current: 0, others: [0]}
            }
            callback(item.profiles)
            browser.storage.local.set({profiles: item.profiles})
        })
    },
    get: (user, key, callback) => {
        return browser.storage.local.get(user.toString()).then((item) => {
            if(item[user.toString()] == undefined) {
                item[user.toString()] = {}
            }

            callback(item[user.toString()][key], item)
        })
    },
    set: (user, key, value) => {
        return browser.storage.local.get(user.toString()).then((item) => {
            if(item[user.toString()] == undefined) {
                item[user.toString()] = {}
            }

            item[user.toString()][key] = value;
            browser.storage.local.set({
                [user.toString()]: item[user.toString()]
            })
        })
    }
}