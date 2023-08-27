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

function App() {
  const [showUI, setShowUI] = useState<boolean>(true);
  const [currentURL, setCurrentURL] = useState<string>("none");

  const loggedIn = useSelector((state: any) => state.loggedIn.value.loggedIn)
  const showTag = useSelector((state: any) => state.pages.value.showTag)
  const showSettings = useSelector((state: any) => state.pages.value.showSettings)

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
        
        if (loggedIn == true) {
          //standard function, checking for linkedIn Profile
          if(currentURL != e.detail.data.payload) {
            console.log("new URL")
            if (e.detail.data.payload.startsWith("https://www.linkedin.com/in/")) {
              setShowUI(true)
              dispatch(changeTag(true));
              dispatch(changeIframe({
                width: "80px",
                height: "50px",
          
              }))

  
              //get profile infor from getProfileInfo.js
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
            dispatch(changeMessage({ message: "loading" }));

          }

        } else {
          //code to check for login token
          if (e.detail.data.payload.includes("app.messageninja.ai")){
            "login sent from app.tsx"
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

        
        const messageData = {
          action: "queryGPT",
          payload: e.detail.data.payload.prompt,
        }
        console.log("queryGPT data")

        console.log(messageData)
        sendEvent(messageData)



      } else if (e.detail.data.action == "returnLoggedIn") {
        console.log("app.tsx recieved this returnLoggedIn")
        console.log(e.detail.data)

        

        if (e.detail.data.payload == "success") {
          console.log("loggedIn, setting loggedIn to true")
          dispatch(changeLoggedIn({ loggedIn: true }));
        } else if (e.detail.data.payload == "failed"){
          console.log("not loggedIn, setting loggedIn to false")
          dispatch(changeLoggedIn({ loggedIn: false }));
        }



      } else if (e.detail.data.action == "returnQueryGPT") {
        dispatch(changeMessage({message: e.detail.data.payload}))
        dispatch(changeLoading({loading: false}))
      } 
  };

  window.addEventListener('contentScriptEvent', handleEvent as EventListener);

  return () => window.removeEventListener('contentScriptEvent', handleEvent as EventListener);
}, [currentURL, loggedIn]);



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
