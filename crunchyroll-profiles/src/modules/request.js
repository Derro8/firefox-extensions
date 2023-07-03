const request = {
    send: (request, callback, before) => {
        let xml = new XMLHttpRequest();

        xml.addEventListener("load", () => { callback(xml) });
        xml.open(request.method.toUpperCase(), request.url);

        if(before)
            before(xml);

        xml.send(request.body);
    },
    override: (urls, methods, callback) => {
        browser.webRequest.onBeforeRequest.addListener(
            (details) => {
                if(typeof(method) === "string" && details.method.toLowerCase() !== method.toLowerCase() || typeof(method) === "object" && method.indexOf(details.method) == -1)
                    return {}
                
                let filter = browser.webRequest.filterResponseData(details.requestId);
                let decoder = new TextDecoder();
                let encoder = new TextEncoder();

                filter.ondata = async (event) => {
                    let str = await callback({details: details, encoder: encoder, decoder: decoder, filter: filter, body: details.requestBody === null && decoder.decode(event.data, {stream: true}) || JSON.parse(decodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes))))})
                    
                    if(filter.status !== "disconnected" && filter.status !== "closed") {
                        filter.write(str !== undefined && encoder.encode(str) || event.data);
                        filter.disconnect();
                    }
                }

                return {}
            },
            {urls: urls},
            ["blocking", "requestBody"]
        )
    },
    block: (urls, method, callback) => {
        browser.webRequest.onBeforeRequest.addListener(
            (details) => {
                if(typeof(method) === "string" && details.method.toLowerCase() !== method.toLowerCase() || typeof(method) === "object" && method.indexOf(details.method) == -1)
                    return {}
                let filter = browser.webRequest.filterResponseData(details.requestId);
                let decoder = new TextDecoder();
                let encoder = new TextEncoder();

                callback({details: details, filter: filter, body: details.requestBody !== null && details.requestBody.raw !== null && JSON.parse(decodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes))))})

                return {cancel: true}
            },
            {urls: urls},
            ["blocking", "requestBody"]
        )
    }
}