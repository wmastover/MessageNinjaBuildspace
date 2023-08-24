import React, { useEffect, useState } from 'react';
import { Tag } from './tag';
import { useSelector, useDispatch } from 'react-redux';
import { useRef } from 'react';
import { changeMessage } from '../redux/messageSlice';
import { BsClipboard, BsFillClipboardCheckFill, BsGear, BsArrowRepeat, BsPencilFill } from 'react-icons/bs';
import { TfiReload } from 'react-icons/tfi'




export const CoreApp: React.FC = () => {
  const [showCoreApp, setShowCoreApp] = useState(false);
  const message = useSelector((state: any) => state.message.value.message)
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const dispatch = useDispatch();


  useEffect(() => {}, [message])

  const handleTagClick = () => {
    setShowCoreApp(!showCoreApp); // Set the state to show the core app
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

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);


  return (
    <>
      {showCoreApp?  
      <div className='app'>
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
              <p className='unselectable'>{message}</p>
              <BsPencilFill className="editIcon" /> 
          </div>
          }
          
        </div>
        <div className='buttonContainer'>
          <button  className="button copy" >
            {copied?  <BsFillClipboardCheckFill /> : <BsClipboard /> }
          </button>
          <button className="button reload" >
            <BsArrowRepeat />  
          </button> 
          <button className="button settings" >
            <BsGear />  
          </button> 
        </div>
      </div>
  
      
      
      : <Tag onClickTag={handleTagClick}/>}
    </>
  );
};

