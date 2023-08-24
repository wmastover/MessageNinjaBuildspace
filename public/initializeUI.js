//use to send data to background script


// function sendMessageToBackgroundScript(data) {
//   chrome.runtime.sendMessage(data, function(response) {
//       console.log("Received response from background:", response);
//   });
// }


//use to send data to app.tsx

// window.addEventListener('event', (e) => {
//   console.log("Event from app.tsx was registered n the content script");
//   console.log(e.detail.data.action);

//   if (e.detail.data.action == "getA") {
//     console.log("= to getURL")
//     console.log(window.location.href)

//     let messageData = {
//       action: "returnURL",
//       payload: window.location.href
//     };
  
//     const event = new CustomEvent('contentScriptEvent', {detail: {data: messageData}});
//     window.dispatchEvent(event);

//   }
// });


//adds app to the webpage
console.log("initialiseUI run")
const app = document.createElement('div');
app.id = 'message-ninja-root';
app.style.width = '300px';  // Setting width to 300px
app.style.height = '225px';




document.body.append(app);
const src = chrome?.runtime?.getURL('/react/index.js');
import(src);

console.log("app added");



function checkURL() {
  // console.log("running checkURL")
  const currentURL = window.location.href;
  
  let messageData = {
          action: "returnURL",
          payload: currentURL
        };
      
  const event = new CustomEvent('contentScriptEvent', {detail: {data: messageData}});
  window.dispatchEvent(event);
  // console.log("sent current url")
}


// Initially check the URL
checkURL();

// Then continue checking the URL every second
setInterval(checkURL, 1000);