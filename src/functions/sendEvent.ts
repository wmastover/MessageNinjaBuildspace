interface EventData {
    action: string;
    payload: any;
}

export const sendEvent = (data: EventData): void => {
    const event = new CustomEvent('event', { detail: { data } });
    window.dispatchEvent(event);
};
