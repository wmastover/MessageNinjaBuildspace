console.log("copyToClipboard.js initiated")

window.addEventListener('event', (e) => {
    
    if (e.detail.data.action == "copyToClipboard") {
      console.log("Event from app.tsx was registered in copyToClipboard.js");
      console.log(e.detail.data.action);

      try {
        // navigator.clipboard API is asynchronous
        navigator.clipboard.writeText(e.detail.data.payload);
        console.log('Text copied to clipboard');
      } catch (err) {
        console.log('Failed to copy text: ', err);
      }
    }
  });





