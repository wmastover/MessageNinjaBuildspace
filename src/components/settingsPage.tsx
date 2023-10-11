import React, { useEffect, useState, useRef } from 'react';
import { Tag } from './tag';
import { useSelector, useDispatch } from 'react-redux';
import { changeMessage } from '../redux/messageSlice';
import { BsClipboard, BsFillClipboardCheckFill, BsGear, BsArrowRepeat, BsPencilFill } from 'react-icons/bs';
import { BiSave, BiSolidSave, BiChevronLeft } from "react-icons/bi";
import { changeIframe } from '../redux/iframeSlice';
import { changeSettings, changeTag } from '../redux/pagesSlice';
import { sendEvent } from '../functions/sendEvent';
import { Dropdown } from '../components/dropdown';
import { changeMessageParams } from '../redux/messageParamsSlice';
import { changeLoading } from '../redux/loadingSlice';
export const SettingsPage: React.FC = () => {
  const initialTemplate = useSelector((state: any) => state.messageParams.value.template);
  const [template, setTemplate] = useState<string>(initialTemplate);

  const personalisationType = useSelector((state: any) => state.messageParams.value.personalisationType);
  const [selectedOption, setSelectedOption] = useState<string | null>(personalisationType);

  const sendersProfile = useSelector((state: any) => state.messageParams.value.linkedInProfile);


  const dispatch = useDispatch();

  useEffect(() => {}, [template,selectedOption]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTemplate(event.target.value);
  };

  const inputRef = useRef<HTMLTextAreaElement>(null);



  const handleBackClick = () => {
    handleSaveClick()
    dispatch(changeIframe({
      width: "400px",
      height: "400px"
    }));
    dispatch(changeSettings(false));

    const messageData = {
      action: "getProfileInfo",
      payload: ""
    }
    sendEvent(messageData)
    dispatch(changeLoading({ loading: true }));

  };

  const handleSaveClick = () => {

    console.log("saved clicked")
    console.log(selectedOption)

    const messageData = {
      action: "storeVariable",
      payload: {
        key: "messageParams",
        value: {
          template: template,
          personalisationType: selectedOption,
          linkedInProfile: sendersProfile
        }
      },
    };
    sendEvent(messageData);
    dispatch(changeMessageParams({
      template: template,
      personalisationType: selectedOption,
      linkedInProfile: sendersProfile
    }));
  };

  const handleResetClick = () => {
    const resetTemplate = `##PersonalisedIntro##
    
Customise this text in settings!`

    const resetSelectedOption = "Experience focus"


    setTemplate(resetTemplate);
    setSelectedOption(resetSelectedOption);

    const messageData = {
      action: "storeVariable",
      payload: {
        key: "messageParams",
        value: {
          template: resetTemplate,
          personalisationType: resetSelectedOption,
        }
      },
    };
    sendEvent(messageData);

    dispatch(changeMessageParams({
      template: resetTemplate,
      personalisationType: resetSelectedOption,
    }));
    
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    handleSaveClick();
  }, [selectedOption, template]);

  return (
    <>
      <div className='settings'>
        <div className="backButton">
          <BiChevronLeft size={20} className='dashIcon' onClick={handleBackClick}/>
        </div>
        <div className="messageTemplateContainer">
          <div className='header'>Message Template</div>
          <textarea
            className='textBoxSettings'
            ref={inputRef}
            
            onChange={(change) => {
              handleInputChange(change);
            }}

            value={template}
          />
        </div>
        <div className="dropDownContainer">
          <div className='header'>Personalisation Type</div>
          <Dropdown 
            // options={["Experience focus", "Activity focus","Automatic",  "Beta - suggest common ground"]}
            options={["Experience focus", "Activity focus",]}  
            initialValue={personalisationType} 
            selectedOption={selectedOption} 
            setSelectedOption={(option) => {
              setSelectedOption(option);
            }}
          />
        </div>
        <div className='buttonContainer'>
          {/* <button className="button copyButton" onClick={handleSaveClick}>
            {saved ? <BiSolidSave/> : <BiSave/>}
          </button> */}
          <button className="button resetButton" onClick={handleResetClick}>
            Reset 
          </button> 
        </div>
      </div>
    </>
  );
};

