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

export const CoreApp: React.FC = () => {
  // const [showCoreApp, setShowCoreApp] = useState(false);
  const [messageArray, setMessageArray] = useState<string[]>([]);
  const [counterText, setCounterText] = useState<string>("");

  const message = useSelector((state: any) => state.message.value.message)
  const showTag = useSelector((state: any) => state.pages.value.showTag)
  const isLoading = useSelector((state: any) => state.loading.value.loading); // assuming you have a combined reducer and `loading` is the key for this slice

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const dispatch = useDispatch();


  useEffect(() => {
    if (message !== "" && !messageArray.includes(message)) {
      setMessageArray([...messageArray, message]);
      setCounterText(`${messageArray.length + 1} of ${messageArray.length + 1 }`);
    }
    

  }, [message, isLoading])

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
  };

  const handleInputBlur = () => {
    setIsEditing(false);
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
      </div>
    </>
  );
};

