console.log("copyToClipboard.js initiated")



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
    
    if (e.detail.data.action == "copyToClipboard") {
      console.log("Event from app.tsx was registered in copyToClipboard.js");
      console.log(e.detail.data.action);

      try {
        // navigator.clipboard API is asynchronous
        navigator.clipboard.writeText(e.detail.data.payload);
        console.log('Text copied to clipboard');

        const toSend = {
          type: "event",
          eventType: "copy",
          message: e.detail.data.payload
      
          }
        sendMessageToBackgroundScript(toSend)


      } catch (err) {
        console.log('Failed to copy text: ', err);
      }
    }
  });





