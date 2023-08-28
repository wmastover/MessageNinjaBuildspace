console.log("store variable contentscript initiated");


function sendMessageToBackgroundScript(message) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });
  }


  window.addEventListener('event', (e) => {
   
    if (e.detail.data.action == "storeVariable") {

        console.log("store variable event in content script ")
        const toSend = {
            type: "storeVariable",
            key: e.detail.data.payload.key,
            value: e.detail.data.payload.value
          };
          console.log(toSend)
        sendMessageToBackgroundScript(toSend).then((response) => {

            console.log(response)
        })
    }
});





