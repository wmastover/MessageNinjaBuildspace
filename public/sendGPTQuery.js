


window.addEventListener('event', (e) => {
    if (e.detail.data.action == "queryGPT") {

        console.log("event detected by sendGPT query")
        const toSend = {
            type: "queryGPT",
            content: e.detail.data.payload,
          }
        

        console.log(toSend)

        sendMessageToBackgroundScript(toSend).then((response) => {


            console.log(response)
            if (response.success) {
        
                console.log(response.output)
                let messageData = {
                    action: "returnQueryGPT",
                    payload: response.output
                    };
    
                const event = new CustomEvent('contentScriptEvent', { detail: { data: messageData } });
                window.dispatchEvent(event);

              } else {

                console.log("error response output:")
                console.log(response.output)
        
              }
        });




    }
})