/*
This script saves the token.
*/


browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    let dec = new TextDecoder();

    filter.ondata = event => {
      self.data = {
          data: Array.apply(null, new Uint8Array(event.data)),

          contentType: details.type
      };
      
      var str = dec.decode(event.data, {stream: true});
      crunchyroll.token = JSON.parse(str).access_token;
      browser.storage.local.set({access: crunchyroll.token})
          
      filter.write(event.data);
    }
    filter.onstop = event => {
      filter.disconnect();
    }
  },
  {urls: [URLS.token]},
  ["blocking"]
);