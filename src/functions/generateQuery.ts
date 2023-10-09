type ProfileData = {
    linkedInProfile: {
        userName: string,
        userDescription: string,
        aboutDescripton: string,
        experience: Array<string>,
        activity: Array<string>
    }
};




export function generateQuery(profileData: ProfileData, personalisationType: string) {
    console.log("generateQuery Running - ")
    console.log(personalisationType)

    if (personalisationType === "Automatic") {
        let promptText = `I need you to create the first "intro" line of a personalized message.

The intro should be succinct, but obviously personalized using the LinkedIn profile information provided.

The intro should start with 'Hey **name**!'

The intro should only focus on a single detail from the given LinkedIn profile.

Use one of the following templates to craft your response:


"Hey **name**, I just came accross your profile and saw **detail**"

"Hey **name**, I was reading through your profile and noticed **detail** "

"Hey **name**, I'm reaching out because I saw your experience in **job**"

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
    
    else if (personalisationType === "Experience focus") {
        let promptText = `I need you to create the first "intro" line of a personalized message.

The intro should be succinct, but obviously personalized using the LinkedIn profile information provided.

The intro should start with 'Hey **name**!'

The intro should only focus on a single detail about the job experience listed in the LinkedIn profile.

Use one of the following templates to craft your response:

"Hey **name**, your experience at **company** caught my attention"

"Hey **name**, congrats on **number of years** at **most recent company**"

"Hey **name**, im reaching out because I saw your experience in **job**"

"Hey **name**, I just came accross your profile and **detail** caught my attention"

Check these things before you reply:

- Make sure it's a very short sentence.
- Make sure you have referenced or commented on a detail from the profile, not just repeated it.
- Make sure you avoid controversial subjects.
- Make sure you don't ask any questions.
- Triple-check that it makes sense.
`;
        const returnDetails = {linkedInProfile: {
            userName: profileData.linkedInProfile.userName,
            userDescription: profileData.linkedInProfile.userDescription,
            experience: profileData.linkedInProfile.experience
        }}


        const query = promptText + `\n\n` + JSON.stringify(returnDetails)
        return query
    }
    else if (personalisationType === "Activity focus") {
        let promptText = `I need you to create the first "intro" line of a personalized message.

The intro should be succinct, but obviously personalized.

The intro should start with 'Hey **name**!'

The intro should comment on something the user has posted or reposted, based on the activity array provided

Use one of the following templates to craft your response:

For "shared" posts, use this template: "Hey **name**, the post you shared about **detail** caught my attention"

For "posted" posts, use this template: "Hey **name**, the I just read the post you wrote about **detail**"

Check these things before you reply:

- Make sure it's a very short sentence.
- Make sure you have referenced or commented on a detail from the profile, not just repeated it.
- Make sure you avoid controversial subjects.
- Make sure you don't ask any questions.
- Triple-check that it makes sense.
`;
        const returnDetails = {linkedInProfile: {
            userName: profileData.linkedInProfile.userName,
            userDescription: profileData.linkedInProfile.userDescription,
            activity: profileData.linkedInProfile.activity
        }}


        const query = promptText + `\n\n` + JSON.stringify(returnDetails)
        return query
    }
}
