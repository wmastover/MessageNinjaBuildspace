import { LinkedInProfileType } from '../types';

export function returnTopics(linkedInProfile: LinkedInProfileType) {
    
    type returnItem = {
        type: string,
        tagline: string,
        details: any
    }
    
    let returnItems: returnItem[] = [];

  if (linkedInProfile.posts) {
        for (let i = 0; i < linkedInProfile.posts.length; i++) {

            const postText = linkedInProfile.posts[i].postText.replace(/\n/g, " ").replace(/Image/g, "").replace(/\s+/g, ' ').trim()
            const postAge = linkedInProfile.posts[i].postAge.replace(/\s+/g, ' ').trim()

            let tagline = `Post ${postAge} ago: ${postText}`
            tagline = tagline.length > 45 ? tagline.substring(0, 45) + '...' : tagline;

            returnItems.push({
                type: "Post",
                tagline: tagline,
                details: linkedInProfile.posts[i]
            });
        }
        for (let i = 0; i < 4 - linkedInProfile.posts.length; i++) {

            if (linkedInProfile.experience[i]) {
                let tagline = linkedInProfile.experience[i].currentlyDoingThisJob ? `Current Job: ${linkedInProfile.experience[i].jobTitle} at ${linkedInProfile.experience[i].companyName}` : `Old Job: ${linkedInProfile.experience[i].jobTitle} at ${linkedInProfile.experience[i].companyName}`
                tagline = tagline.length > 45 ? tagline.substring(0, 45) + '...' : tagline;

                returnItems.push({
                    type: "Job",
                    tagline: tagline,
                    details: linkedInProfile.experience[i]
                });
            }
        }
    }

  return returnItems;
}
