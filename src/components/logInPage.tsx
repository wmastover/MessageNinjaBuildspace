import React, { useEffect, useState } from 'react';
import { useSelector} from 'react-redux';

export const LoginPage: React.FC = () => {
  const loggedIn = useSelector((state: any) => state.loggedIn.value.loggedIn); // assuming you have a combined reducer and `loading` is the key for this slice

  useEffect(() => {}, [loggedIn])

  return (
    <div className='Tag' style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }} >

      {/* this doesnt work because of loggedIn unrendering the app on messageNinja when set to true */}
    {loggedIn?<>Yo!</> : <a href="https://app.messageninja.ai" target="_blank" rel="noopener noreferrer">
      Login
    </a> }
  </div>
  );
};

