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
        
        const prompt = `I need you to create the first "intro" line of a personalized message.

        The intro should be succinct, but obviously personalized using the LinkedIn profile information provided.
        
        The intro should start with 'Hey **name**!'
        
        The intro should only focus on a single detail from the given LinkedIn profile.
        
        Check these things before you reply:
        
        - Make sure it's a very short sentence.
        - Make sure you have referenced or commented on a detail from the profile, not just repeated it.
        - Make sure you avoid controversial subjects.
        - Make sure you don't ask any questions.
        - Triple-check that it makes sense.
        `;
  
        query = prompt + `\n\n` + JSON.stringify(profileObject)
        
        returnValue = {
          prompt: query,
          profile: profileObject
        }
  

      } else if (url.includes("www.linkedin.com/sales/lead")) {
  
  
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
          // const leftPanel = document.getElementsByClassName("pv-text-details__left-panel")[0]
  
          let name = ""
          let userDescription = ""
  
  
          // const nameElement = leftPanel?.getElementsByTagName("h1");
          const nameElement = document.querySelector('[data-anonymize="person-name"]');
          if (nameElement) {
            name = nameElement.textContent
          }
  
          const userDescriptionElement = document.querySelector('[data-anonymize="headline"]');
          if (userDescriptionElement ) {
            userDescription = userDescriptionElement.textContent
          }
          if (name) {
            profileObject.linkedInProfile.userName = name.trim()
          }
          if (userDescription) {
            profileObject.linkedInProfile.userDescription = userDescription.trim()
          }
          
          // queryText+= `
          // \n Users Name: ${name}\n
          // \n User Description: ${userDescription}\n `
  
        } catch(err) {
          console.log("error with description")
        }
  
        // get about panel 
        try{
          const aboutPanel = document.querySelector('[data-anonymize="person-blurb"]')
  
          const aboutText = aboutPanel.getAttribute('title');
  
          if (aboutText) {
            profileObject.linkedInProfile.aboutDescripton = aboutText.trim()
          }
          
          } catch(err) {
            console.log("error with about")
          }
  
          try{
            const experiencePanel = document.getElementById("experience-section")
  
            const experiencePanelItems = experiencePanel.getElementsByClassName("_experience-entry_1irc72")
  
            let itterations = 0
            if (experiencePanelItems) {
              if (experiencePanelItems.length > 3) {
                itterations = 3
              } else {
                itterations = experiencePanelItems.length
              }
              for (let i = 0; i < itterations; i++) {
              
                const experiencePanelItem = experiencePanelItems[i]
             
                const jobTitleElement = experiencePanelItem.querySelector('[data-anonymize="job-title"]');
                const jobTitle = jobTitleElement ? jobTitleElement.textContent : "";


                const jobDescriptionElement = experiencePanelItem.querySelector('[data-anonymize="person-blurb"]');
                const jobDescription = jobDescriptionElement ? jobDescriptionElement.textContent : "";

                const experience = {
                  jobTitle: jobTitle.trim(),
                  jobDescription: jobDescription.trim()
                };

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
        
        const prompt = `I need you to create the first "intro" line of a personalized message.

        The intro should be succinct, but obviously personalized using the LinkedIn profile information provided.
        
        The intro should start with 'Hey **name**!'
        
        The intro should only focus on a single detail from the given LinkedIn profile.
        
        Check these things before you reply:
        
        - Make sure it's a very short sentence.
        - Make sure you have referenced or commented on a detail from the profile, not just repeated it.
        - Make sure you avoid controversial subjects.
        - Make sure you don't ask any questions.
        - Triple-check that it makes sense.
        `;
  
        query = prompt + `\n\n` + JSON.stringify(profileObject)
        
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
        }, 1000); // Delay of 2 seconds
    }
});





