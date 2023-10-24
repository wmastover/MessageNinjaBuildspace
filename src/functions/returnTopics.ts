import { LinkedInProfileType } from '../types';

//take input of a linkedIn profile, return 3 + objects, containing a tagline string, and the abridged profile version for generating query

// export type LinkedInProfileType = {
//     userName: string;
//     userDescription: string;
//     aboutDescripton: string;
//     experience: any[]; // You can replace 'any' with a specific type if needed
//     posts: any[]; // You can replace 'any' with a specific type if needed
// }


// let post = {
//     postAge: postAge.trim(),
//     postType: postType.trim(),
//     postText: activityContent.trim()
//   }

// let job = {
//     jobTitle: jobTitle,
//     companyName: companyName,
//     currentlyDoingThisJob: currentlyDoingThisJob,
//     timeInJob: timeInJob,
//     otherJobNotes: jobDescription
//   }


export function returnTopics(linkedInProfile: LinkedInProfileType) {
    
    type returnItem = {
        type: string,
        tagline: string,
        details: any
    }
    
    //if linkedInProfile contains 3 posts, return 3 return items based off each post + one based off the first job experience. If there is less than 3, fill the spaces with return items based off experiences 

    let returnItems: returnItem[] = [];
    
    // Check if the LinkedIn profile has posts and if it has at least 3 posts


  if (linkedInProfile.posts) {
        // If it doesn't, create return items for all available posts
        for (let i = 0; i < linkedInProfile.posts.length; i++) {

            const postText = linkedInProfile.posts[i].postText.replace(/\n/g, " ").replace(/Image/g, "").replace(/\s+/g, ' ').trim()
            const postAge = linkedInProfile.posts[i].postAge.replace(/\s+/g, ' ').trim()

            returnItems.push({
                // Cleaned up taglines to remove excess whitespace
                type: "Post",
                tagline: `Post ${postAge} ago: ${postText}`,
                details: linkedInProfile.posts[i]
            });
        }
        // Fill the remaining spaces with return items based on experiences
        for (let i = 0; i < 4 - linkedInProfile.posts.length; i++) {
            returnItems.push({
                type: "Job",
                tagline: linkedInProfile.experience[i].currentlyDoingThisJob ? `Current Job: ${linkedInProfile.experience[i].jobTitle} at ${linkedInProfile.experience[i].companyName}` : `Old Job: ${linkedInProfile.experience[i].jobTitle} at ${linkedInProfile.experience[i].companyName}`,
                details: linkedInProfile.experience[i]
            });
        }
    }
    

    console.log("topics: ", returnItems);

  return returnItems;
}
