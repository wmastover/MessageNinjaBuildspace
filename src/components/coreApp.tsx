import React, { useEffect, useState } from 'react';
import { Tag } from './tag';
import { useSelector, useDispatch } from 'react-redux';
import { useRef } from 'react';
import { changeMessage } from '../redux/messageSlice';
import { BsClipboard, BsFillClipboardCheckFill, BsGear, BsArrowRepeat, BsPencilFill, BsDash } from 'react-icons/bs';
import { changeIframe } from '../redux/iframeSlice';
import { changeSettings, changeTag } from '../redux/pagesSlice';
import { sendEvent } from '../functions/sendEvent';
import { AiOutlineLoading3Quarters,  } from "react-icons/ai"
import { changeLoading } from '../redux/loadingSlice';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa"
import { generateQuery } from '../functions/generateQuery';

export const CoreApp: React.FC = () => {
  // const [showCoreApp, setShowCoreApp] = useState(false);
  const [messageArray, setMessageArray] = useState<string[]>([]);
  const [counterText, setCounterText] = useState<string>("");
  const [isUserEdited, setIsUserEdited] = useState<boolean>(false);

  const message = useSelector((state: any) => state.message.value.message)
  const showTag = useSelector((state: any) => state.pages.value.showTag)
  const isLoading = useSelector((state: any) => state.loading.value.loading); // assuming you have a combined reducer and `loading` is the key for this slice
  const topics = useSelector((state: any) => state.topics.value)
  const linkedInProfile = useSelector((state: any) => state.linkedInProfile.value)
  const senderslinkedInProfile = useSelector((state: any) => state.messageParams.value.linkedInProfile)

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const dispatch = useDispatch();


  useEffect(() => {
    if (message !== "" && !messageArray.includes(message) && !isUserEdited) {
      setMessageArray([...messageArray, message]);
      setCounterText(`${messageArray.length + 1} of ${messageArray.length + 1 }`);
    }
  }, [message, isLoading, isUserEdited, topics, linkedInProfile, senderslinkedInProfile]) // Add isUserEdited as a dependency

  

  const handleSettingsClick = () => {
    dispatch(changeIframe({
      width: "400px",
      height: "500px"

    }))
    // setShowCoreApp(!showCoreApp);
    dispatch(changeSettings(true)); // Set the state to show the core app
  };


  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(changeMessage({ message: event.target.value }));
    setIsUserEdited(true); // Set isUserEdited to true when user starts editing
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    setIsUserEdited(false); // Set isUserEdited back to false when user finishes editing
  };

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleTextClick = () => {
    setIsEditing(true);
    setCopied(false)
  };


  const handleReloadClick = () => {

    const messageData = {
      action: "reloadMessage",
      payload: message,
    }
    sendEvent(messageData)
    dispatch(changeLoading({loading: true}))
    setCopied(false)
   
  }

  const handleCopyClick = () => {
    setCopied(true)

    const messageData = {
      action: "copyToClipboard",
      payload: message
    }

    sendEvent(messageData)
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);


  const handleRightChevron = () => {
    let index = messageArray.indexOf(message);
    if (index === messageArray.length - 1) {
      dispatch(changeMessage({ message: messageArray[0]}));
      setCounterText(`${1} of ${messageArray.length}`);
    } else {
      dispatch(changeMessage({ message: messageArray[index + 1]}));
      setCounterText(`${index + 2} of ${messageArray.length}`);
    }
  }

  const handleLeftChevron = () => {
    let index = messageArray.indexOf(message);
    if (index === 0) {
      dispatch(changeMessage({ message: messageArray[messageArray.length - 1]}));
      setCounterText(`${messageArray.length} of ${messageArray.length}`);
    } else {
      dispatch(changeMessage({ message: messageArray[index - 1]}));
      setCounterText(`${index} of ${messageArray.length}`);
    }
  }


  const handleTopicClick = (topicIndex: number) => {
    console.log("topic index", topicIndex)


    if (topics[topicIndex]) {
      dispatch(changeLoading({loading: true}))
      const generateQueryInput = {
        sendersProfile: senderslinkedInProfile,
        receiversProfile: linkedInProfile,
        topic: topics[topicIndex]
      }
      console.log("running generate query")
      const query = generateQuery(generateQueryInput)
  

      console.log("sending query to bgs", query)
      const messageData = {
        action: "queryGPT",
        payload: query,
      }
      sendEvent(messageData)

      

    } else {
      window.alert("no topic")
    }
    
    
    
  }
  return (
    <>
      <div className='app' >

        <BsDash className="dashIcon" onClick={() => {
          dispatch(changeIframe({
            width: "80px",
            height: "80px",
          }))

          dispatch(changeTag(true))
        }}/>

        <div className="messageCounter">{counterText}</div>
        <div className="textBoxContainer">
          
          {messageArray.length > 1 && 
            <>
              <FaChevronLeft className="chevronIcon" style={{position: 'absolute', top: '205px', left: '14px'}} onClick={() => { handleLeftChevron()}}/>
              <FaChevronRight className="chevronIcon" style={{position: 'absolute', top: '205px', right: '14px'}} onClick={() => { handleRightChevron()}}/>
            </>
          }
          {isEditing ?
            <textarea
              className='textBox'
              ref={inputRef}
              onBlur={handleInputBlur}
              onChange={handleInputChange}
              value={message}
            />
            : 

            <div className='textBox' onClick={handleTextClick}> 
            
              {isLoading?
                <AiOutlineLoading3Quarters className='spinning' style={{position: 'absolute', top: '205px', left: '47%'}} size={25}/>
                :
                <div className='textBoxContent'>
                  {message.split('\n').map((line: string, index: number) => (
                    <React.Fragment key={index}>
                      {line}
                      {index !== message.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                  <BsPencilFill className="editIcon" /> 
                </div>
              } 
            </div>
   
          }
          
        </div>
        <div className='buttonContainer'>
          <button  className="button copyButton" onClick={() => {handleCopyClick()}} >
            {copied?  <BsFillClipboardCheckFill /> : <BsClipboard /> }
          </button>
          <button className="button reloadButton" onClick={() => {handleReloadClick()}}>
            <BsArrowRepeat/>  
          </button> 
          <button className="button settingsButton" onClick={() => {handleSettingsClick()}} >
            <BsGear />  
          </button> 
        </div>
        <div className='topicsContainer'>
          <span className="topicHeader" >👇 Focus on another topic 👇</span>
          <button  className={topics[1] ? "button topicButtonTop" : "buttonUnselectable topicButtonTop"} onClick={() => {handleTopicClick(1)}} >
            {topics[1]? topics[1].tagline : ""}
          </button>
          <button  className={topics[2] ? "button topicButtonMiddle" : "buttonUnselectable topicButtonMiddle"} onClick={() => {handleTopicClick(2)}} >
            {topics[2]? topics[2].tagline : ""}
          </button>
          <button  className={topics[3] ? "button topicButtonBottom" : "buttonUnselectable topicButtonBottom"} onClick={() => {handleTopicClick(3)}} >
          {topics[3]? topics[3].tagline : ""}
          </button>
        </div>
      </div>
    </>
  );
};

