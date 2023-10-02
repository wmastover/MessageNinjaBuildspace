// Log the initiation of contentscript info
console.log("loggin contentscript info initiated");

// Function to search for and retrieve a login token from the page
const getToken = (url, document) => {
    // Initialize returnToken with "no token"
    var returnToken = "no token";
  
    // Check if the url includes "https://app.messageninja.ai"
    if (url.includes("https://app.messageninja.ai")) {
      try {
        // Get the authentication token from the HTML on app.messageninja.ai
        const token = document.getElementById("authenticationToken")?.textContent;
        // Log the token
        console.log("this is the token");
        console.log(token);
        // If token exists, set returnToken to token
        if (token) {
          returnToken = token;
        }
      } catch {
        // Log any errors within getToken
        console.log("error with getToken");
      }
    } else {
      // Log if the url is not "https://app.messageninja.ai"
      console.log("Not https://app.messageninja.ai");
    }
    
    // Return the token
    return returnToken;
  };
  

// Function to send a message to the background script
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

// Check if the user is logged in automatically as soon as login.js runs

const toSend = {
type: "checkLogin"

}
// Send checkLogin to background script and handle the response
sendMessageToBackgroundScript(toSend).then((response) => {
    // Check if the user is logged in from the response of the background script
    if (response.success == true) {
        
      // Send a message to the background script to get stored message params (template + personalisationType)
      const toSend1 = {
        type: "getVariable",
        key: "messageParams"
    
        }
      // Send the message and handle the response
      sendMessageToBackgroundScript(toSend1).then((response) => {
        
        // Define the message data
        let messageData1 = {
            action: "returnMessageParams",
            payload: response.value
            };
        
        // Wait 2 seconds to make sure UI has loaded then send these values back to the front end
        setTimeout(() => {
          // Dispatch a custom event with the message data
          const event = new CustomEvent('contentScriptEvent', { detail: { data: messageData1 } });
          window.dispatchEvent(event);
          }, 2000);
      
      })
       

    } else if (response.success == false) {
        // Log if the user is not logged in
        console.log("not logged in")

        // Log the response
        console.log(response)
        // Define the message data
        let messageData = {
          action: "returnLoggedIn",
          payload: "failed"
          };

      // Wait 2 seconds then dispatch a custom event with the message data
      setTimeout(() => {
      const event = new CustomEvent('contentScriptEvent', { detail: { data: messageData } });
      window.dispatchEvent(event);
      }, 2000);
    }
})




// Add an event listener for 'event'
window.addEventListener('event', (e) => {
   
    // Check if the action is "logIn"
    if (e.detail.data.action == "logIn") {
        // Log that the event from app.tsx was registered in login.js
        console.log("Event from app.tsx was registered in login.js");
        // Log the action
        console.log(e.detail.data.action);

        // Wait 2 seconds then execute the following
        setTimeout(() => {

            // Get the token
            const token = getToken(window.location.href, document)
        

            // Check if a token was found
            if (token != "no token") {
            

                // Log that a token was found
                console.log("token found")
                try {
                  // Define the message to send
                  const toSend = {
                    type: "login",
                    token: token,
                  };
                  // Send the message and handle the response
                  sendMessageToBackgroundScript(toSend).then((response) => {
                    // If the response is successful, log success and the response
                    if (response.success) {
                      console.log("send token to background script success");
                      console.log(response);

                      // Define the message data
                      let messageData = {
                        action: "returnLoggedIn",
                        payload: "success"
                        };
        
                        // Dispatch a custom event with the message data
                        const event = new CustomEvent('contentScriptEvent', { detail: { data: messageData } });
                        window.dispatchEvent(event);
                      
                    } else {
                      // If the response is not successful, log failure and the response
                      console.log("send token to background script failure");
                      console.log(response);
                      
                        // Define the message data
                        let messageData = {
                            action: "returnLoggedIn",
                            payload: "fail"
                            };
        
                        // Dispatch a custom event with the message data
                        const event = new CustomEvent('contentScriptEvent', { detail: { data: messageData } });
                        window.dispatchEvent(event);

                    }
                  });
                } catch (error) {
                  // Log any errors
                  console.log("response --");
                  console.log(error.message);
                }  
              } else {
                // Log if no token was found
                console.log("no token")
              }

            
        }, 2000); // Delay of 2 seconds
    }
});






