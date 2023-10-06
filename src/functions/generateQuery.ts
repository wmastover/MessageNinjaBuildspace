type ProfileData = {
    linkedInProfile: {
        userName: string,
        userDescription: string,
        aboutDescripton: string,
        experience: Array<{ jobTitle: string, jobDescription: string }>
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
}
