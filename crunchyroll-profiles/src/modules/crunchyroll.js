class crunchyArray {
    constructor() {
        this.result = {
            total: 0,
            data: [],
            meta: {
                total_before_filter: 0
            }
        }

        this.push = (item) => {
            this.result.total++;
            this.result.meta.total_before_filter++;

            this.result.data.push(item);
        }

        this.pop = (index) => {
            if(index < 0) return;

            this.result.total--;
            this.result.meta.total_before_filter--;

            this.result.data.pop(index);
        }

        this.set = (key, value) => {
            this.meta[key] = value;
        }

        this.stringify = () => {
            return JSON.stringify(this.result);
        }
    }
}

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

browser.storage.local.get("access").then(item => {
  crunchyroll.token = item.access;  
})