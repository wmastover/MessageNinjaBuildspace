console.log("get profile info initiated");



// used to get the prompt to send to openAI from a url and the content
const getPrompt =  (url, document) => {


    let queryText = "";
    let query = ""
    let returnValue = {
      prompt: null,
      profile: null,
    }
  
      
      if (url.includes("www.linkedin.com/in")) {
  
  
        const profileObject = {
          linkedInProfile: {
            userName: "",
            userDescription: "",
            aboutDescripton: "",
            experience: [],
          }
        }
  
        // get name and description pannel 
        try {
          const leftPanel = document.getElementsByClassName("pv-text-details__left-panel")[0]
  
          let name = ""
          let userDescription = ""
  
  
          const nameElement = leftPanel?.getElementsByTagName("h1")
          if (nameElement) {
            name = nameElement[0].textContent.split(" ")[0]
          }
  
          const userDescriptionElement = leftPanel?.getElementsByTagName("div")[1]
          if (userDescriptionElement ) {
            userDescription = userDescriptionElement.textContent
          }
          if (name) {
            profileObject.linkedInProfile.userName = name
          }
          if (userDescription) {
            profileObject.linkedInProfile.userDescription = userDescription
          }
          
          // queryText+= `
          // \n Users Name: ${name}\n
          // \n User Description: ${userDescription}\n `
  
        } catch(err) {
          console.log("error with description")
        }
  
        // get about panel 
        try{
          const aboutPanel = document.getElementById("about")
  
          const aboutPanelItems = aboutPanel.parentElement
  
          const aboutPanel2 = aboutPanelItems.getElementsByClassName("inline-show-more-text")[0]
  
          const aboutTextItems = aboutPanel2.getElementsByTagName("span")[0]
  
  
          const aboutText = aboutTextItems.textContent
  
          if (aboutText) {
            profileObject.linkedInProfile.aboutDescripton = aboutText
          }
          // queryText+= `
          
          // \n About: ${aboutText}\n `
          
  
          } catch(err) {
            console.log("error with about")
          }
  
  
          // get experience panel 
          try{
            const experiencePanel = document.getElementById("experience")
  
            const experiencePanelItemsContainer = experiencePanel.parentElement
  
            const experiencePanelItems = experiencePanelItemsContainer.getElementsByClassName("artdeco-list__item")
  
            let itterations = 0
            if (experiencePanelItems) {
              if (experiencePanelItems.length > 3) {
                itterations = 3
              } else {
                itterations = experiencePanelItems.length
              }
              for (let i = 0; i < itterations; i++) {
              
                const experiencePanelItem = experiencePanelItems[i]
                const array = experiencePanelItem.querySelectorAll('span[aria-hidden="true"]')
    
                let experience = `\n `
                
                
    
                for (let i = 0; i < array.length; i++) {
                  experience += ` ${array[i].textContent} \n`
                }
                if (experience) {
                  profileObject.linkedInProfile.experience.push(experience)
                }
                // queryText+= `
                // \n Experience: ${experience}\n `
              }
            }
          } catch(err) {
            console.log("error with experience")
          }
        
        const prompt = `
  Create a succinct, personalized one-liner for the following LinkedIn user, using their profile information. The message should be a very short sentence and start with 'Hey **name**!'. Please reference a single detail from their profile information. Avoid controversial subjects and questions. Make sure to reference or comment on profile information, not just parrot it back. The reply should not contain any information about the sender.
  
  Above all the reply should make sense, read well and be as succinct as possible.
  
  Here is the JSON object containing the LinkedIn profile details:`
  
        query = prompt + `\n` + JSON.stringify(profileObject)
        
        returnValue = {
          prompt: query,
          profile: profileObject
        }
  
      } else {
        query = "not linkedIn"
        
        returnValue = {
          prompt: query,
          profile: null
        }
        
      }
    
    return(returnValue)
  }


window.addEventListener('event', (e) => {
    
    if (e.detail.data.action == "getProfileInfo") {
      console.log("Event from app.tsx was registered in getProfileInfo.js");
      console.log(e.detail.data.action);


        setTimeout(() => {

            const prompt = getPrompt(window.location.href, document)
            
            console.log(prompt);

            let messageData = {
                action: "returnProfileInfo",
                payload: prompt
            };

            const event = new CustomEvent('contentScriptEvent', { detail: { data: messageData } });
            window.dispatchEvent(event);
        }, 2000); // Delay of 2 seconds
    }
});





