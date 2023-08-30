import React, { useEffect, useState } from 'react';
import { Tag } from './tag';
import { useSelector, useDispatch } from 'react-redux';
import { useRef } from 'react';
import { changeMessage } from '../redux/messageSlice';
import { BsClipboard, BsFillClipboardCheckFill, BsGear, BsArrowRepeat, BsPencilFill } from 'react-icons/bs';
import { changeIframe } from '../redux/iframeSlice';
import { changeSettings, changeTag } from '../redux/pagesSlice';
import { sendEvent } from '../functions/sendEvent';
import { AiOutlineLoading3Quarters,  } from "react-icons/ai"
import { changeLoading } from '../redux/loadingSlice';

export const CoreApp: React.FC = () => {
  // const [showCoreApp, setShowCoreApp] = useState(false);
  const message = useSelector((state: any) => state.message.value.message)
  const showTag = useSelector((state: any) => state.pages.value.showTag)
  const isLoading = useSelector((state: any) => state.loading.value.loading); // assuming you have a combined reducer and `loading` is the key for this slice

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const dispatch = useDispatch();


  useEffect(() => {}, [message, isLoading])

  const handleSettingsClick = () => {
    dispatch(changeIframe({
      width: "300px",
      height: "400px"

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


  return (
    <>
      <div className='app' >
        <div className="textBoxContainer">
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
            <AiOutlineLoading3Quarters className='spinning' size={25}/>
            :
            <>
            <div className='unselectable'>
            {message.split('\n').map((line: string, index: number) => (
              <React.Fragment key={index}>
                {line}
                {index !== message.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
              </div>
              <BsPencilFill className="editIcon" /> 
            </>
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

