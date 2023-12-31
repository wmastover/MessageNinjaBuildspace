



// Function to inject script into a tab
function injectScript(tab) {
  // Avoid executing scripts on chrome:// URLs
  if (tab.url && tab.url.startsWith("chrome://")) {
    return;
  }

  // Execute the content script regardless of the URL.
  // The content script itself will decide whether to add or remove the UI based on the URL.
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ["initializeUI.js"]
  });
}

// Listen for the creation of new tabs and inject script
chrome.tabs.onCreated.addListener(injectScript);


//firebaseConfig

try {
  // you need to manually have firebase-compat.js file in your dir
self.importScripts('./firebase-compat.js');

// Firebase configuration details
const firebaseConfig = {
  apiKey: "AIzaSyB78Wj5cPff9GdU7KPB7fXvI5NfA7BKDxI",
  authDomain: "messageninja-5f315.firebaseapp.com",
  projectId: "messageninja-5f315",
  storageBucket: "messageninja-5f315.appspot.com",
  messagingSenderId: "207350695816",
  appId: "1:207350695816:web:49fddbb5cd70e3f2ab5c3d",
  measurementId: "G-8SQ6MFBG7B"
};

// Initialize Firebase with the configuration
firebase.initializeApp(firebaseConfig);

// Create a Firestore database instance
var db = firebase.firestore();

} catch (e) {
// Log any errors during initialization
console.error(e);
}


// Function to store a variable in local storage
function storeVariable(key, value) {
  chrome.storage.local.set({ [key]: value }, () => {
    console.log(`Value for '${key}' is set to '${value}'.`);
  });
}

// Retrieve a variable
function getVariable(key, callback) {
  chrome.storage.local.get([key], (result) => {
    callback(result[key]);
  });
}

function sendEventToFirestore(request) {
  let eventDocument = {
    message: request.message,
    eventType: request.eventType,
    timestamp: firebase.firestore.FieldValue.serverTimestamp() // Add timestamp if you want to keep track of when the event was logged
  };

  let user = firebase.auth().currentUser;
  if (user) { // Check if user is authenticated before trying to add data to Firestore
    db.collection('users').doc(user.uid).collection('events').add(eventDocument)
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  } else {
    console.log("User not authenticated. Please authenticate before logging events.");
  }
}

// Add a listener that runs a function when the chrome extension is uninstalled
chrome.runtime.setUninstallURL('http://goodbye.messageninja.ai/', function() {
  console.log('Uninstall URL set');
  
  // Function to send an event to Firestore
  sendEventToFirestore({message: 'Extension uninstalled', eventType: 'uninstall'});

});

  
const firebaseFunctions = firebase.functions();

//talks to firebase function 
async function queryGPT3(queryGPTInput) {
  console.log("queryGPTInput");
  console.log(queryGPTInput);
  const prompt = queryGPTInput.content;

  console.log(prompt);

  let messages = [
    {"role": "system", "content":  "You are an messaging assistant, that writes highly personalised 'intro' lines for messages. You can only respond with a short sentance. You cannot use emojis, quotation marks or hashtags."},
    {"role": "user", "content": prompt},
  ]

  try {
    const queryGPT3 = firebaseFunctions.httpsCallable('queryGPT3');
    const output = await queryGPT3({ messages });
    
    
    messages.push({"role": "assistant", "content": output.data});
    storeVariable("Messages", messages);
    return output.data;
  } catch (error) {
    throw new Error("Failed to query GPT API. Message: " + error.message);
  }
}


//talks to firebase function 
async function reloadQueryGPT() {

  const result = await new Promise((resolve) => getVariable("Messages", resolve));
  let messages = result;

  console.log("messages");
  console.log(messages);

  if (messages) {
    messages.push({"role": "user", "content": "Try again, use another template, do not repeat messages"});
  } else {
    messages = [];
  }

  console.log("reload messages");
  console.log(messages);

  try {
    const queryGPT3 = firebaseFunctions.httpsCallable('queryGPT3');
    const output = await queryGPT3({ messages });
    

    messages.push({"role": "assistant", "content": output.data});
    storeVariable("Messages", messages);
    return output.data;
  } catch (error) {
    throw new Error("Failed to query GPT API. Message: " + error.message);
  }
}


// Store a variable

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  console.log("background message recived")
  if(request.type == "queryGPT") {
    console.log("type = queryGPT")
    
    queryGPTInput = {
      content: request.content,
    }

    console.log("listener input")
    console.log(request)

    queryGPT3(queryGPTInput)
    .then((output) => {
      sendResponse({ success: true, output });
    })
    .catch((error) => {
      sendResponse({ success: false, output: error.message });
    });
  // Keep the channel open for the asynchronous response
  return true;

  } else if(request.type == "reloadMessage") {
    console.log("type = reloadMessage")
    

    console.log("listener input")
    console.log(request)

    reloadQueryGPT()
    .then((output) => {
      sendResponse({ success: true, output });
    })
    .catch((error) => {
      sendResponse({ success: false, output: error.message });
    });
  // Keep the channel open for the asynchronous response
  return true;

  } else if (request.type == "storeVariable") {
    console.log("type = store var")

    storeVariable(request.key, request.value)
    console.log("store variable completed")

    sendResponse({ success: true});
    return true;

  } else if (request.type == "getVariable") {
    getVariable(request.key, (value, error) => {
      if (error) {
        sendResponse({ success: false, message: error.message });
      } else if (value !== undefined) {
        sendResponse({ success: true, value });
      } else {
        sendResponse({ success: false, message: 'Unexpected error occurred while retrieving the value.' });
      }
    });
    // Keep the channel open for the asynchronous response
    return true;
  } else if (request.type == "login"){

    console.log("login in background running")

    firebase.auth().signInWithCustomToken(request.token).then((user) => {
      // User is signed in
      console.log(user)
      console.log("User is signed in");
      sendResponse({ success: true });
    }).catch((error) => {
      console.log(" error in login")
      console.log('error', error)
      sendResponse({ success: false });
    })
    return true;
  } else if (request.type == "checkLogin") {
    firebase.auth().onAuthStateChanged((user) => {
      
      if (user) {
        console.log('User is signed in:', user);
        // User is signed in, perform some operations if you need
        // Search Firestore for the document for that user
        db.collection('users').doc(user.uid).get().then((doc) => {
          if (doc.exists) {
            // Check if the user has a credits value in the DB
            if ('credits' in doc.data()) {
              // Return the number of credits that user has
              let credits = doc.data().credits;
              storeVariable("credits", credits)
              sendResponse({ success: true });
            } else {
              console.log('No credits value in the DB for this user, updating the user now');
              console.log(doc.data())
              // If no credits value in DB, add a credits value = to 20, and a paid value = to false this code is to handle legacy users
              db.collection('users').doc(user.uid).set({
                credits: 20,
                paid: false
              }, { merge: true });
              storeVariable("credits", 20)
              sendResponse({ success: true });
            }
          } else {
            console.log('No such document!');
            sendResponse({ success: false, message: 'No such document!' });
          }
        }).catch((error) => {
          console.log('Error getting document:', error);
          sendResponse({ success: false, message: error.message });
        });
        sendResponse({ success: true })
      } else {
        console.log('No user is signed in.');
        // No user is signed in, you can redirect the user to a login page
        // ...
        sendResponse({ success: false })
      }
    });
    return true;


} else if (request.type == "event") {
 
  sendEventToFirestore(request)
  
  return true;
} else if (request.type == "tagClicked"){

  getVariable("credits", function(value) {
    let credits = value;
    if (credits > 0) {
      sendResponse({ success: true });
      credits--;
      console.log(credits)
      storeVariable("credits", credits);
      let user = firebase.auth().currentUser;
      if (user) {
        db.collection('users').doc(user.uid).update({
          credits: credits
        })
        .then(() => {
          console.log("Credits updated successfully.");
        })
        .catch((error) => {
          console.error("Error updating credits: ", error);
        });
      } else {
        console.log("User not authenticated. Please authenticate before updating credits.");
      }


      
      sendResponse({ success: true });
    } else {
      console.log("0 Credits left")
      chrome.tabs.create({url: "https://credits.messageninja.ai/"});
      sendResponse({ success: false })
    }
  });  
  return true;
}




});


  
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({url: "https://app.messageninja.ai/"});
  }
});


  

