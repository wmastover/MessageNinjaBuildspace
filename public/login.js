console.log("loggin contentscript info initiated");


const getToken = (url, document) => {
    var returnToken = "no token";
  
    if (url.includes("https://app.messageninja.ai")) {
      try {
        const token = document.getElementById("authenticationToken")?.textContent;
        console.log("this is the token");
        console.log(token);
        if (token) {
          returnToken = token;
        }
      } catch {
        console.log("error with getToken");
      }
    } else {
      console.log("Not https://app.messageninja.ai");
    }
    
    return returnToken;
  };
  

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

//check if the user is logged in

const toSend = {
type: "checkLogin"

}

sendMessageToBackgroundScript(toSend).then((response) => {
    if (response.success) {
        
        console.log("logged In")
        
        // let messageData = {
        //     action: "returnLoggedIn",
        //     payload: "success"
        //     };

        // setTimeout(() => {
        // const event = new CustomEvent('contentScriptEvent', { detail: { data: messageData } });
        // window.dispatchEvent(event);
        // }, 2000);

    } else if (response.success == false) {
        console.log("not logged in")
        console.log(response)
        let messageData = {
          action: "returnLoggedIn",
          payload: "failed"
          };

      setTimeout(() => {
      const event = new CustomEvent('contentScriptEvent', { detail: { data: messageData } });
      window.dispatchEvent(event);
      }, 2000);
    }
})




window.addEventListener('event', (e) => {
   
    if (e.detail.data.action == "logIn") {
        console.log("Event from app.tsx was registered in login.js");
        console.log(e.detail.data.action);

        setTimeout(() => {

            const token = getToken(window.location.href, document)
        

            if (token != "no token") {
            

                console.log("token found")
                try {
                  const toSend = {
                    type: "login",
                    token: token,
                  };
                  sendMessageToBackgroundScript(toSend).then((response) => {
                    if (response.success) {
                      console.log("send token to background script success");
                      console.log(response);

                      let messageData = {
                        action: "returnLoggedIn",
                        payload: "success"
                        };
        
                        const event = new CustomEvent('contentScriptEvent', { detail: { data: messageData } });
                        window.dispatchEvent(event);
                      
                    } else {
                      console.log("send token to background script failure");
                      console.log(response);
                      
                        let messageData = {
                            action: "returnLoggedIn",
                            payload: "fail"
                            };
        
                        const event = new CustomEvent('contentScriptEvent', { detail: { data: messageData } });
                        window.dispatchEvent(event);

                    }
                  });
                } catch (error) {
                  console.log("response --");
                  console.log(error.message);
                }  
              } else {
                console.log("no token")
              }

            
        }, 2000); // Delay of 2 seconds
    }
});





