import { LinkedInProfileType, topicType } from '../types';



type GenerateQueryInputType= {
    sendersProfile: LinkedInProfileType,
    receiversProfile: LinkedInProfileType,
    topic: topicType
}


export function generateQuery(GenerateQueryInput: GenerateQueryInputType) {
    console.log("linkedIn profile")

    console.log("generateQuery Running - ")
    console.log(GenerateQueryInput.topic)
    console.log(GenerateQueryInput.sendersProfile)
    console.log(GenerateQueryInput.receiversProfile)

    const topic = GenerateQueryInput.topic
    const profileData = GenerateQueryInput.receiversProfile
    const usersProfileData = GenerateQueryInput.sendersProfile

    if (topic.type === "Automatic") {
        let promptText = `I need you to create the first "intro" line of a personalized message.

The intro should be succinct, but obviously personalized using the LinkedIn profile information provided.

The intro should start with 'Hey **first name**!'

The intro should only focus on a single detail from the given LinkedIn profile.

Use one of the following templates to craft your response:


"Hey **first name**, I just came accross your profile and saw **detail**"

"Hey **first name**, I was reading through your profile and noticed **detail** "

"Hey **first name**, I'm reaching out because I saw your experience in **job**"

Check these things before you reply:

- Make sure it's a very short sentence.
- Make sure you have referenced or commented on a detail from the profile, not just repeated it.
- Make sure you avoid controversial subjects.
- Make sure you don't ask any questions.
- Triple-check that it makes sense.
`;

        const query = promptText + `\n\n` + JSON.stringify(profileData)


        console.log(query)
        return query;

    } 
    
    else if (topic.type === "Job") {

        if (topic.details.currentlyDoingThisJob) {
            //current job

            let promptText = `I need you to create the first "intro" line of a personalized message.

            The intro should be succinct, but obviously personalized using the LinkedIn profile information provided.
            
            The intro should start with 'Hey **first name**!'
            
            The intro should only focus on a single detail about the job experience listed in the LinkedIn profile.
            
            Use one of the following templates to craft your response:
            
            Only use this if timeInJob is less than 6 months - "Hey **first name**, congrats on the new role as **job title** at **company** " 
            
            Only use this if timeInJob is less more than 1 year - "Hey **first name**, congrats on **rounded number of years** at **current company**"
            
            "Hey **first name**, your experience at **company** caught my attention"
            
            "Hey **first name**, I just came accross your profile and **detail** caught my attention"
            
            Check these things before you reply:
            
            - Make sure it's a very short sentence.
            - Make sure you have referenced or commented on a detail from the profile, not just repeated it.
            - Make sure you avoid controversial subjects.
            - Make sure you don't ask any questions.
            - Triple-check that it makes sense.
            `;
            const returnDetails = {linkedInProfile: {
                userName: profileData.userName,
                userDescription: profileData.userDescription,
                experience: topic.details
            }}
    
    
            const query = promptText + `\n\n` + JSON.stringify(returnDetails)
            return query


        } else {
            let promptText = `I need you to create the first "intro" line of a personalized message.

            The intro should be succinct, but obviously personalized using the LinkedIn profile information provided.
            
            The intro should start with 'Hey **first name**!'
            
            The intro should only focus on a single detail about the old job experience listed in the LinkedIn profile (they are not currently working the job mentioned).
            
            Use one of the following templates to craft your response:
            
            "Hey **first name**, I just came accross your profile and **detail** caught my attention"

            "Hey **first name**, I'm interested to hear about your time at **company**"

            "Hey **first name**, I saw that you used to work as **job title** at **company**"
            
            Check these things before you reply:
            
            - Make sure it's a very short sentence.
            - Make sure you have referenced or commented on a detail from the profile, not just repeated it.
            - Make sure you avoid controversial subjects.
            - Make sure you don't ask any questions.
            - Triple-check that it makes sense.
            `;
            const returnDetails = {linkedInProfile: {
                userName: profileData.userName,
                userDescription: profileData.userDescription,
                experience: topic.details
            }}
    
    
            const query = promptText + `\n\n` + JSON.stringify(returnDetails)
            return query


        }
        
    }
    else if (topic.type === "Post") {
        let promptText = `I need you to create the first "intro" line of a personalized message.

The intro should be succinct, but obviously personalized.

The intro should start with 'Hey **first name**!'

The intro should comment on something the user has posted or reposted, based on the activity array provided

Use one of the following templates to craft your response:

For "shared" posts, use this template: "Hey **first name**, the post you shared about **detail** caught my attention"

For "posted" posts, use this template: "Hey **first name**, the I just read the post you wrote about **detail**"

Check these things before you reply:

- Make sure it's a very short sentence.
- Make sure you have referenced or commented on a detail from the profile, not just repeated it.
- Make sure you avoid controversial subjects.
- Make sure you don't ask any questions.
- Triple-check that it makes sense.
`;
        const returnDetails = {linkedInProfile: {
            userName: profileData.userName,
            userDescription: profileData.userDescription,
            posts: topic.details
        }}


        const query = promptText + `\n\n` + JSON.stringify(returnDetails)
        return query
    } else if (topic.type === "Beta - suggest common ground") {

    //         let promptText = `I need you to create the first "intro" line of a personalized message.
    
    // The intro should be succinct, but obviously personalized using the LinkedIn profile information provided.
    
    // The intro should start with 'Hey **name**!'
    
    // The intro should only focus on a single similarity between the sender, and the reciever
    
    // Check these things before you reply:
    
    // - Make sure it's a very short sentence.
    // - Make sure you have referenced or commented on a detail from the profile, not just repeated it.
    // - Make sure you avoid controversial subjects.
    // - Make sure you don't ask any questions.
    // - Triple-check that it makes sense.
    // `;
    
    let promptText = `Name a similarity between the sender and reciever. 
    
   Focus on shared work history (similar jobs or industries)
   
   If there is no obvious similarities, just return "no similarities"`

            const query = promptText + `\n\n Message sender:\n\n ` + JSON.stringify(usersProfileData) + `\n\n Message receiver:\n\n ` + JSON.stringify(profileData)
    
    
            console.log(query)
            return query;
    
        } 
    
}
