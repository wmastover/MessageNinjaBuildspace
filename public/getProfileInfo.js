console.log("get profile info initiated");

// used to get the prompt to send to openAI from a url and the content
const getPrompt = (url, document) => {


  let queryText = "";
  let query = ""
  let returnValue = {
    prompt: null,
    profile: null,
    saveProfile: null,

  }

  if (url.includes("www.linkedin.com/in")) {


    const profileObject = {
      linkedInProfile: {
        userName: "",
        userDescription: "",
        aboutDescripton: "",
        experience: [],
        posts: [],
      }
    }

    // get name and description pannel 
    try {
      const leftPanel = document.getElementsByClassName("pv-text-details__left-panel")[0]

      let name = ""
      let userDescription = ""


      const nameElement = leftPanel?.getElementsByTagName("h1")
      if (nameElement && nameElement.length > 0) {
        name = nameElement[0].textContent.split(" ")[0]
      }

      const userDescriptionElement = leftPanel?.getElementsByTagName("div")[1]
      if (userDescriptionElement && userDescriptionElement.length > 0) {
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

    } catch (err) {
      console.log("error with description")
    }

    // get about panel 
    try {
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


    } catch (err) {
      console.log("error with about")
    }


    // get experience panel 
    try {
      const experiencePanel = document.getElementById("experience")

      const experiencePanelItemsContainer = experiencePanel.parentElement

      const experiencePanelItems = experiencePanelItemsContainer.getElementsByClassName("artdeco-list__item")

      let itterations = 0
      if (experiencePanelItems && experiencePanelItems.length > 0) {
        if (experiencePanelItems.length > 3) {
          itterations = 3
        } else {
          itterations = experiencePanelItems.length
        }
        for (let i = 0; i < itterations; i++) {


          const experiencePanelItem = experiencePanelItems[i]
          const array = experiencePanelItem.querySelectorAll('span[aria-hidden="true"]')

          try {
            const jobTitle = array[0].textContent

            const companyName = array[1].textContent.split("·")[0]

            var currentlyDoingThisJob = null

            let timeInJob = array[2].textContent.split("·")[1]

            //change abreviations so they never come up in final message
            if (timeInJob.includes("mos")) {
              timeInJob = timeInJob.replace("mos", "months")
            } else if (timeInJob.includes("mo")) {
              timeInJob = timeInJob.replace("mo", "month")
            }
            if (timeInJob.includes("yrs")) {
              timeInJob = timeInJob.replace("yrs", "years")
            } else if (timeInJob.includes("yr")) {
              timeInJob = timeInJob.replace("yr", "year")
            }


            if (array[2].textContent.includes("Present")) {
              currentlyDoingThisJob = true
            } else {
              currentlyDoingThisJob = false
            }


            //add optional(on linkedIn) fields to "otherJobNotes"
            let otherJobNotes = ""
            for (let i = 3; i < array.length; i++) {
              let clonedSpan = array[i].cloneNode(true)

              //replace breaks with spaces in HTML, to stop it concatinating random words together
              clonedSpan.innerHTML = clonedSpan.innerHTML.replace(/<br\s*\/?>/g, ' ')
              otherJobNotes += ` ${clonedSpan.textContent} \n`
            }

            let job = {
              jobTitle: jobTitle,
              companyName: companyName,
              currentlyDoingThisJob: currentlyDoingThisJob,
              timeInJob: timeInJob,
              otherJobNotes: otherJobNotes
            }

            if (job) {
              profileObject.linkedInProfile.experience.push(job)
            }

          } catch (err) {
            console.log("error scraping specific job likely due to multiple jobs under one company")

            let otherJobNotes = ""
            for (let i = 0; i < array.length; i++) {
              let clonedSpan = array[i].cloneNode(true)

              //replace breaks with spaces in HTML, to stop it concatinating random words together
              clonedSpan.innerHTML = clonedSpan.innerHTML.replace(/<br\s*\/?>/g, ' ')
              otherJobNotes += ` ${clonedSpan.textContent} \n`
            }

            job = {
              otherJobNotes: otherJobNotes
            }

            if (job) {
              profileObject.linkedInProfile.experience.push(job)
            }
          }
        }
      }
    } catch (err) {
      console.log("error with experience")
    }

    try {
      const activityPanel = document.getElementById("content_collections")

      const activityPanelParent = activityPanel.parentElement

      const activityPanelItems = activityPanelParent.getElementsByClassName("profile-creator-shared-feed-update__mini-container")

      console.log("activity panel items length:")
      console.log(activityPanelItems.length)

      let itterations = 0
      if (activityPanelItems && activityPanelItems.length > 0) {
        if (activityPanelItems.length > 3) {
          itterations = 3
        } else {
          itterations = activityPanelItems.length
        }
        for (let i = 0; i < itterations; i++) {
          try {
            const activityPanelItem = activityPanelItems[i]

            const array = activityPanelItem.querySelectorAll('a')

            let activity = `\n `

            //only add posts written by the user
            const detailsLine = array[0].getAttribute('aria-label').replace("View full post.", "");

            let postAge = detailsLine.split("•")[1]
            const postAgeInt = parseInt(postAge.replace("m", "").replace("w", ""));

            console.log(postAge + " post age");

            //check if post is over 3 months old, if so don't scrape it
            if (postAge.includes("mo") && postAgeInt > 3) {
              console.log("post too old ", postAge);

            } else {
              postAge = postAge.replace("w", " weeks")

              if (postAge.includes("mo")) {
                postAge = postAge.replace("mo", " months")
              } else if (postAge.includes("m")) {
                postAge = postAge.replace("m", " minutes")
              } else if (postAge.includes("d")) {
                postAge = postAge.replace("d", " days")
              }

              const postTypeLine = detailsLine.split("•")[0]
              let postType = ""

              if (postTypeLine.includes("reposted")) {
                postType = "shared a post"

              } else if (postTypeLine.includes("posted")) {
                postType = "posted"

                console.log("Details line: ", detailsLine);
                console.log("Post age: ", postAge);
                console.log("Post type: ", postType);



                for (let i = 1; i < array.length; i++) {
                  let activityText = array[i].getAttribute('aria-label');
                  if (activityText) {
                    activityText = activityText.replace("View full post.", "");
                    activity += ` ${activityText} \n`
                  }
                }
                let post = {
                  postAge: postAge,
                  postType: postType,
                  postText: activity

                }

                if (post) {
                  profileObject.linkedInProfile.posts.push(post)
                }
              }
            }
          } catch (err) {
            console.log("Error in activity iteration: ", i, err);
          }
        }
      }


      // queryText+= `

      // \n About: ${aboutText}\n `


    } catch (err) {
      console.log("error with activity panel")
      console.log(err)
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
      profile: profileObject,
      saveProfile: url === "https://www.linkedin.com/in/me/" ? true : false
    }


  } else if (url.includes("www.linkedin.com/sales/lead")) {


    const profileObject = {
      linkedInProfile: {
        userName: "",
        userDescription: "",
        aboutDescripton: "",
        experience: [],
        activity: [],
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
      if (userDescriptionElement) {
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

    } catch (err) {
      console.log("error with description")
    }

    // get about panel 
    try {
      const aboutPanel = document.querySelector('[data-anonymize="person-blurb"]')

      const aboutText = aboutPanel.getAttribute('title');

      if (aboutText) {
        profileObject.linkedInProfile.aboutDescripton = aboutText.trim()
      }

    } catch (err) {
      console.log("error with about")
    }

    try {
      const experiencePanel = document.getElementById("experience-section")

      const experiencePanelItems = experiencePanel.getElementsByClassName("_experience-entry_1irc72")

      let itterations = 0
      if (experiencePanelItems && experiencePanelItems.length > 0) {
        if (experiencePanelItems.length > 3) {
          itterations = 3
        } else {
          itterations = experiencePanelItems.length
        }
        for (let i = 0; i < itterations; i++) {
          try {
            const experiencePanelItem = experiencePanelItems[i]

            const jobTitleElement = experiencePanelItem.querySelector('[data-anonymize="job-title"]');
            const jobTitle = jobTitleElement ? jobTitleElement.textContent.trim() : "";

            const parentElement = jobTitleElement ? jobTitleElement.parentElement : null;

            const companyName = parentElement ? parentElement.querySelector('p')?.textContent.trim() : null;

            //get tiime in Job
            const secondPElement = parentElement ? parentElement.querySelectorAll('p')[1] : null;
            const secondPElementText = secondPElement ? secondPElement?.textContent.trim() : null;
            const spanElementText = secondPElement ? secondPElement.querySelector('span')?.textContent.trim() : null;

            let timeInJob = secondPElementText ? secondPElementText.replace(spanElementText, "").trim() : 'null'

            if (timeInJob.includes("mos")) {
              timeInJob = timeInJob.replace("mos", "months")
            } else if (timeInJob.includes("mo")) {
              timeInJob = timeInJob.replace("mo", "month")
            }
            if (timeInJob.includes("yrs")) {
              timeInJob = timeInJob.replace("yrs", "years")
            } else if (timeInJob.includes("yr")) {
              timeInJob = timeInJob.replace("yr", "year")
            }
            // currently doing job
            let currentlyDoingThisJob = null

            if (secondPElementText.includes("Present")) {
              currentlyDoingThisJob = true
            } else {
              currentlyDoingThisJob = false
            }

            const jobDescriptionElement = experiencePanelItem.querySelector('[data-anonymize="person-blurb"]');
            const jobDescription = jobDescriptionElement ? jobDescriptionElement.textContent : "";

            let job = {
              jobTitle: jobTitle,
              companyName: companyName,
              currentlyDoingThisJob: currentlyDoingThisJob,
              timeInJob: timeInJob,
              otherJobNotes: jobDescription
            }

            if (job) {
              profileObject.linkedInProfile.experience.push(job)
            }
          } catch (err) {
            console.log("Error in experience iteration: ", i, err);
          }
        }
      }
    } catch (err) {
      console.log("error with experience", err)
    }


    try {
      const activityPanel = document.getElementById("relationship-section")

      const activityPanelItems = activityPanel.getElementsByClassName("_recent-activities-item_7c496i")

      // article-text_ulix4y

      let itterations = 0

      if (activityPanelItems) {
        if (activityPanelItems.length > 3) {
          itterations = 3
        } else {
          itterations = activityPanelItems.length
        }
        for (let i = 0; i < itterations; i++) {
          try {
            const activityPanelItem = activityPanelItems[i]

            const activityTimeElement = activityPanelItem.querySelector('time');
            const activityTime = activityTimeElement ? activityTimeElement.textContent : "";

            let postAge = activityTime.replace("ago", "")
            const postAgeInt = parseInt(postAge.replace("mo", "").replace("w", "").replace("d", "").replace("h", "").replace("m", ""));

            //check if post is over 3 months old, if so don't scrape it
            if (postAge.includes("mo") && postAgeInt > 3) {
              console.log("post too old ", postAge);

            } else {
              postAge = postAge.replace("w", " weeks")

              if (postAge.includes("mo")) {
                postAge = postAge.replace("mo", " months")
              } else if (postAge.includes("m")) {
                postAge = postAge.replace("m", " minutes")
              } else if (postAge.includes("d")) {
                postAge = postAge.replace("d", " days")
              }

              const activityTypeElement = activityPanelItem.querySelector('h4');
              let activityType = activityTypeElement ? activityTypeElement.textContent : "";

              // Wierd sales navigator quirk,  posted => shared, reshared => shared
              let postType = ""

              if (activityType.includes("reshared")) {
                postType = "shared a post"

              } else if (activityType.includes("shared")) {
                // only save posts that are posted
                postType = "posted"

                const activityContent = Array.from(activityPanelItem.querySelectorAll('header ~ div span'))
                  .map(span => span.textContent)
                  .join('');

                let post = {
                  postAge: postAge.trim(),
                  postType: postType.trim(),
                  postText: activityContent.trim()
                }

                if (post) {
                  profileObject.linkedInProfile.posts.push(post)
                }
              }
            }
          } catch (err) {
            console.log("Error in activity iteration: ", i, err);
          }
        }
      }
    } catch (err) {
      console.log("error with activity")
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
      profile: profileObject,
      saveProfile: false
    }

  } else {
    query = "not linkedIn"

    returnValue = {
      prompt: query,
      profile: null,
      saveProfile: false,
    }

  }


  return (returnValue)
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





