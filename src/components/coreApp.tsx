import React, { useEffect, useState } from 'react';
import { Tag } from './tag';
import { useSelector } from 'react-redux';



export const CoreApp: React.FC = () => {

  const [showCoreApp, setShowCoreApp] = useState(false);
  const message = useSelector((state: any) => state.message.value.message)

  const containerStyle = {
    width: '100px',
    height: '200px',
    backgroundColor: 'yellow', // Adding a background color for visualization
  };


  useEffect(() => {


  }, [message])



  const handleTagClick = () => {
    setShowCoreApp(!showCoreApp); // Set the state to show the core app
  };
  return (
    <>
      {showCoreApp?  <div style={containerStyle}>{message}</div> : <Tag onClickTag={handleTagClick}/>}
    </>
  );
};

