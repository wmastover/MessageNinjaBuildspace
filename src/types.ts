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

