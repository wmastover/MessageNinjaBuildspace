import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Frame from 'react-frame-component'
import { Provider } from 'react-redux'
import { store }from './redux/reduxStore'


// const iframeStyle = {
//   overflow: 'hidden',
//   borderStyle: 'none',
//   position: 'fixed',
//   right: '0',
//   top: '50px',
//   width: "300px",
//   height: "225px",
//   zIndex: 999999
// };


// ReactDOM.render(
//   <React.StrictMode>
//     <Provider store={store}>
//     <Frame
//       id="messageninja"
//       scrolling='no'
//       style={iframeStyle}
//       head={[
//         <link
//           key='0'
//           type='text/css'
//           rel='stylesheet'
//           href={chrome.runtime.getURL('/react/index.css')}
//         />,
//       ]}
//     >
      
//         <App />
     
//     </Frame>
//     </Provider>
//   </React.StrictMode>,
//   document.getElementById('message-ninja-root')
// )

import { useSelector } from 'react-redux';

function MainComponent() {
  const iframeWidth = useSelector((state: any) => state.iframe.value.width);
  const iframeHeight = useSelector((state: any) => state.iframe.value.height);

  let iframeStyle = {
    overflow: 'hidden',
    borderStyle: 'none',
    position: 'fixed',
    right: '0',
    top: '50px',
    width: iframeWidth,
    height: iframeHeight,
    zIndex: 999999
  };

  useEffect(() => {
    
    let iframeStyle = {
      overflow: 'hidden',
      borderStyle: 'none',
      position: 'fixed',
      right: '0',
      top: '50px',
      width: iframeWidth,
      height: iframeHeight,
      zIndex: 999999
    };

  }, [iframeHeight, iframeWidth])

  return (
      
        <Frame
          id="messageninja"
          scrolling='no'
          style={iframeStyle}
          head={[
            <link
              key='0'
              type='text/css'
              rel='stylesheet'
              href={chrome.runtime.getURL('/react/index.css')}
            />,
          ]}
        >
            <App />
        </Frame>
      
  );
}

ReactDOM.render(
  
<React.StrictMode>
<Provider store={store}>
  <MainComponent/>
  </Provider>
</React.StrictMode>, document.getElementById('message-ninja-root'));
