export interface MyCustomEventData {
    data: string;
  }
  
export interface AnotherCustomEventData {
    data: {
        action: string;
        payload: any; // You can replace 'any' with a specific type if needed
    };
}

export type loadingSliceType = {
    loading: boolean
}

export type loggedInSliceType = {
    loggedIn: boolean
}

export type messageSliceType = {
    message: string
}

export type iframeSliceType = {
    width: string;
    height: string
}

export type pagesSliceType = {
    showTag: boolean;
    showSettings: boolean
}


export type LinkedInProfileType = {
    userName: string;
    userDescription: string;
    aboutDescripton: string;
    experience: any[]; // You can replace 'any' with a specific type if needed
    posts: any[]; // You can replace 'any' with a specific type if needed
}

export type messageParamsSliceType = {
    template: string;
    personalisationType: string;
    linkedInProfile?: LinkedInProfileType;
}


export type topicType = {
    type: string;
    tagline: string;
    details: any;
}
