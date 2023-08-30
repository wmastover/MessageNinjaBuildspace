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

export const SettingsPage: React.FC = () => {
  const initialTemplate = useSelector((state: any) => state.messageParams.value.template);
  const [template, setTemplate] = useState<string>(initialTemplate);

  const personalisationType = useSelector((state: any) => state.messageParams.value.personalisationType);
  const [selectedOption, setSelectedOption] = useState<string | null>(personalisationType);

  const [saved, setSaved] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {}, [template,selectedOption]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTemplate(event.target.value);
  };

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleBackClick = () => {
    dispatch(changeIframe({
      width: "300px",
      height: "225px"
    }));
    dispatch(changeSettings(false));
  };

  const handleSaveClick = () => {
    setSaved(true);
    const messageData = {
      action: "storeVariable",
      payload: {
        key: "messageParams",
        value: {
          template: template,
          personalisationType: personalisationType,
        }
      },
    };
    sendEvent(messageData);
    dispatch(changeMessageParams({
      template: template,
      personalisationType: personalisationType,
    }));
  };

  const handleResetClick = () => {
    const resetTemplate = `##PersonalisedIntro##
    
I just started using Message Ninja, its a real game changer!`

    const resetSelectedOption = "Automatic"


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

  return (
    <>
      <div className='settings'>
        <div className="backButton">
          <BiChevronLeft size={20} onClick={handleBackClick}/>
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
          <Dropdown 
            // options={["Automatic", "Work Experience Focus", "Focus on 'about' details"]} 
            options={["Automatic",]} 
            initialValue={personalisationType} 
            selectedOption={selectedOption} 
            setSelectedOption={setSelectedOption}
          />
        </div>
        <div className='buttonContainer'>
          <button className="button copyButton" onClick={handleSaveClick}>
            {saved ? <BiSolidSave/> : <BiSave/>}
          </button>
          <button className="button resetButton" onClick={handleResetClick}>
            Reset 
          </button> 
        </div>
      </div>
    </>
  );
};
