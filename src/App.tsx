import './App.css'
import { useEffect, useState} from 'react';
import { AnotherCustomEventData } from "./types"
import { CoreApp } from './components/coreApp';
import {LoginPage} from './components/logInPage'
import { sendEvent } from './functions/sendEvent';
import { useSelector , useDispatch} from 'react-redux';
import { changeLoggedIn } from './redux/loggedInSlice';
import { changeMessage } from './redux/messageSlice';
import { changeLoading } from './redux/loadingSlice';
import { changeTag } from './redux/pagesSlice';
import { changeIframe } from './redux/iframeSlice';
import { SettingsPage } from './components/settingsPage';
import { Tag } from './components/tag';
import { changeMessageParams } from './redux/messageParamsSlice';

function App() {
  //toggle for showing or hiding the UI
  const [showUI, setShowUI] = useState<boolean>(true);

  // toggle for showing the loading / loaded tag or the app UI
  const showTag = useSelector((state: any) => state.pages.value.showTag)

  //contains the current url, updates sent each second from the content script
  const [currentURL, setCurrentURL] = useState<string>("none");

  //defaults to true, changes if the check comes back failed, shows login page if not logged in
  const loggedIn = useSelector((state: any) => state.loggedIn.value.loggedIn)
  
  //toggles to show the settings page
  const showSettings = useSelector((state: any) => state.pages.value.showSettings)

  //contains the template to use when displaying the message
  const template = useSelector((state: any) => state.messageParams.value.template)

  const dispatch = useDispatch();


  const handleTagClick = () => {
    dispatch(changeIframe({
      width: "300px",
      height: "225px"

    }))
    // setShowCoreApp(!showCoreApp);
    dispatch(changeTag(false)); // Set the state to show the core app
  };



  useEffect(() => {
    console.log("rerunning use effect")

  //runs when event is recieved by the content script
  const handleEvent = (e: CustomEvent<AnotherCustomEventData>) => {

      //checks if its an updated URL
      if (e.detail.data.action == "returnURL") {
        //only run gpt queries when loggedIn
        if (loggedIn == true) {
          //checking for a new linkedIn Profile 
          if(currentURL != e.detail.data.payload) {

            console.log("new URL")
            if (e.detail.data.payload.startsWith("https://www.linkedin.com/in/")) {
              // resize iframe, then show tag for loading
              dispatch(changeIframe({
                width: "80px",
                height: "50px",
          
              }))
              setShowUI(true)
              dispatch(changeTag(true));


              //get profile information from getProfileInfo.js
              const messageData = {
                action: "getProfileInfo",
                payload: ""
              }
              sendEvent(messageData)
  
            } else {
              setShowUI(false)
            }
            setCurrentURL(e.detail.data.payload)
            dispatch(changeLoading({ loading: true }));

          }

        } else if (loggedIn == false ) {
          console.log("logged in: ")
          console.log(loggedIn)
          //code to check for login token
          if (e.detail.data.payload.includes("app.messageninja.ai")){

            console.log("login sent from app.tsx")

            const messageData = {
              action: "logIn",
              payload: ""
            }
            sendEvent(messageData)
          }
        }
        

      } else if (e.detail.data.action == "returnProfileInfo") {
        console.log("app.tsx recieved this returnProfileInfo")
        console.log(e.detail.data.payload)


        // send event to run gpt query from background.jjs
        const messageData = {
          action: "queryGPT",
          payload: e.detail.data.payload.prompt,
        }
        sendEvent(messageData)

      } else if (e.detail.data.action == "returnMessageParams") {
        console.log("app.tsx recieved this returnMessageParams")
        console.log(e.detail.data.payload)

        //should run at load and add message params to the app from storage, if its not null or undefined
        if (e.detail.data.payload) {
          dispatch(changeMessageParams(e.detail.data.payload))
        }
        
      } else if (e.detail.data.action == "returnLoggedIn") {
        console.log("app.tsx recieved this returnLoggedIn")
        console.log(e.detail.data.payload)

        if (e.detail.data.payload == "success") {
          console.log("loggedIn should be set to true ")
          dispatch(changeLoggedIn({loggedIn: true}))

          window.alert("Hello, Welcome, Howdy! You are loggedIn to message ninja, navigate to a linkedIn profile to start!")

        } else if ( e.detail.data.payload == "failed") {
          console.log("loggedIn should be set to false ")
          dispatch(changeLoggedIn({loggedIn: false}))
        } else {
          console.log("error with returnLoggedIn")
          console.log(e.detail.data.payload)
        }

      
      } else if (e.detail.data.action == "returnQueryGPT") {
        console.log("app.tsx recieved this returnQueryGPT")
        console.log(e.detail.data.payload)


        //code to fit message into the template
        let message1 = template.replace( "##PersonalisedIntro##" ,e.detail.data.payload) 
        dispatch(changeMessage({message: message1}))
        dispatch(changeLoading({loading: false}))
      } 
  };

  window.addEventListener('contentScriptEvent', handleEvent as EventListener);

  // this apparently stops memory leak
  return () => window.removeEventListener('contentScriptEvent', handleEvent as EventListener);
}, [currentURL, loggedIn, template]);


  return (
  <>
  {loggedIn ?
    <>
      {showUI ?
      <>
        {showTag? 
          <Tag onClickTag={() => {handleTagClick()}}/> 
          : 
          <>
          {showSettings? <SettingsPage/> : <CoreApp/>}
          </> 
          }
      </>
        : 
      <>
      </>
      }
    </>
    :
    <LoginPage/>
  }


  
  </>
  )
}

export default App;
