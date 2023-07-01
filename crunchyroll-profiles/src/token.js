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

      browser.storage.local.set({
          token: JSON.parse(str).access_token
      })
          
      filter.write(event.data);
    }
    filter.onstop = event => {
      filter.disconnect();
    }
  },
  {urls: ["https://www.crunchyroll.com/auth/v1/token"]},
  ["blocking"]
);