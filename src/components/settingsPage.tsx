import React, { useEffect, useState } from 'react';
import { Tag } from './tag';
import { useSelector, useDispatch } from 'react-redux';
import { useRef } from 'react';
import { changeMessage } from '../redux/messageSlice';
import { BsClipboard, BsFillClipboardCheckFill, BsGear, BsArrowRepeat, BsPencilFill } from 'react-icons/bs';
import { BiSave, BiSolidSave, BiChevronLeft } from "react-icons/bi"
import { changeIframe } from '../redux/iframeSlice';
import { changeTag } from '../redux/pagesSlice';
import { sendEvent } from '../functions/sendEvent';
import { Dropdown } from '../components/dropdown';


export const SettingsPage: React.FC = () => {
  // const [showCoreApp, setShowCoreApp] = useState(false);
  const [template, setTemplate] = useState<string>("#personalisedLine CTA");
  const showTag = useSelector((state: any) => state.pages.value.showTag)

  const [saved, setSaved] = useState<boolean>(false);

  const dispatch = useDispatch();


  useEffect(() => {}, [template])

  const handleTagClick = () => {
    dispatch(changeIframe({
      width: "300px",
      height: "225px"

    }))
    // setShowCoreApp(!showCoreApp);
    dispatch(changeTag(false)); // Set the state to show the core app
  };


  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTemplate(event.target.value) 
  };


  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleTextClick = () => {
    setSaved(false)
  };


  const handleReloadClick = () => {

    const messageData = {
      action: "reloadMessage",
      payload: "",
    }
    sendEvent(messageData)
    dispatch(changeMessage({ message: "loading" }));


  }

  const handleCopyClick = () => {
    setSaved(true)

  };

  useEffect(() => {
      inputRef.current?.focus();
   
  }, []);


  return (
    <>
      <div className='settings' >
      <div className="backButton" >
        <BiChevronLeft size={20} />
      </div>
        <div className="messageTemplateContainer">
            <div className='header'>Message Template</div>
            <textarea
              className='textBox'
              ref={inputRef}
              onChange={handleInputChange}
              value={template}
            />
        </div>
        <div className="dropDownContainer">
            <div className='header'>Personalisation Type</div>
            <Dropdown options={["aaa", "bbb"]}/>
        </div>
        <div className='buttonContainer'>
          <button  className="button copyButton" onClick={() => {handleCopyClick()}} >
            {saved?  <BiSolidSave/> : <BiSave/> }
          </button>
          <button className="button reloadButton" onClick={() => {handleReloadClick()}}>
            Reset 
          </button> 
        </div>
      </div>
    </>
  );
};

