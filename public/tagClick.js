console.log("tagClick.js initiated")



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
    
    if (e.detail.data.action == "tagClicked") {
      console.log("Event from app.tsx was registered in tagClicked.js");
      console.log(e.detail.data.action);

      try {
        
        console.log('Text copied to clipboard');

        const toSend = {
          type: "tagClicked"
          }

        sendMessageToBackgroundScript(toSend).then((response) => {

            console.log(response)
            if (response.success) {
                let messageData = {
                    action: "tagClickApproved",
                    payload: ""
                    };
    
                const event = new CustomEvent('contentScriptEvent', { detail: { data: messageData } });
                window.dispatchEvent(event);
            }
          })
        
        const toSendEvent = {
        type: "event",
        eventType: "tagClick",
        message: ""
    
        }

        sendMessageToBackgroundScript(toSendEvent)

      } catch (err) {
        console.log('Failed to complete tag clicked: ', err);
      }
    }
  });





