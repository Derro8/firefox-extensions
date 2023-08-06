/*
This script saves the token.
*/



request.override([URLS.token], "POST", (info) => {
  let data = JSON.parse(info.body);

  crunchyroll.token = data.access_token;
  browser.storage.local.set({access: crunchyroll.token});

  return JSON.stringify(data);
})