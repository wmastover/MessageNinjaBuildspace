import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import Frame from 'react-frame-component'
import { Provider } from 'react-redux'
import { store }from './redux/reduxStore'

const iframeStyle = {
  overflow: 'hidden',
  borderStyle: 'none',
  position: 'fixed',
  right: '0',
  top: '50px',
  width: '100px',
  height: '200px',
  zIndex: 999999
};


ReactDOM.render(
  <React.StrictMode>
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
      <Provider store={store}>
        <App />
      </Provider>
    </Frame>
  </React.StrictMode>,
  document.getElementById('message-ninja-root')
)
