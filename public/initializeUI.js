
//adds app to the webpage
console.log("initialiseUI run")
const app = document.createElement('div');
app.id = 'message-ninja-root';



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