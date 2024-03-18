export const notificationContext = "https://www.w3.org/ns/solid/notification/v1"
export const activityStreamsContext = "https://www.w3.org/ns/activitystreams"

type Channel = {
    channel: string;
}

type Subscription = {
    subscription: string;
}

export class DescriptionResource {
    id: string;
    channels: Channel[];
    subscriptions: Subscription[];
    
    constructor(id: string, channels: Channel[], subscriptions: Subscription[]) {
        this.id = id;
        this.channels = channels ;
        this.subscriptions = subscriptions;
    }

    generateDoc = () => {
        let base = {
            "@context": [notificationContext],
            "id": this.id,
        }
        let newBase = base;
        if (this.subscriptions) {
            newBase = Object.assign(base, {"subscription" : this.subscriptions})
        }
        if (this.channels) {
            newBase = Object.assign(base, {"channel" : this.channels})
        }

        return newBase;
    }
}

export enum ChannelType {
    WebSocketChannel2023,
}

export class SubscriptionService {
    id: string
    channelType: ChannelType
    features: Object

    constructor(id: string, channelType: ChannelType, features: {}) {
        this.id = id;
        this.channelType = channelType || ChannelType.WebSocketChannel2023;
        this.features = features;
    }

    generateDoc = () => {
        let base = {
            "@context": [notificationContext],
            "id": this.id,
            "channelType": this.channelType,
        }
        let newBase = base;
        if (this.features) {
            newBase = Object.assign(base, {"feature": this.features});
        }
        return newBase
    }
}

export class NotificationChannel {
    id: string
    type: ChannelType
    topics: string[]
    features: Object
    receiveFrom?: string 
    sendTo?: string
    sender?: string

    constructor(id: string, 
        type: ChannelType, 
        topics: string[], 
        features: Object, 
        receiveFrom?: string,
        sendTo?: string,
        sender?: string) {
        this.id = id;
        this.type = type || ChannelType.WebSocketChannel2023;
        this.topics = topics;
        this.features = features ;
        // do these really need to be stored or can they be assigned dynamically?
        this.receiveFrom = receiveFrom;
        this.sendTo = sendTo;
        this.sender = sender;
    }

    generateDoc = () => {
        let base = {
            "@context": [notificationContext],
            "id": this.id,
            "type": this.type,
            "topic": this.topics,
        }
        let newBase = base;
        if (this.features) {
            newBase = Object.assign(base, this.features);
        }
        if (this.receiveFrom) {
            newBase = Object.assign(base, {"receiveFrom": this.receiveFrom});
        }
        if (this.sendTo) {
            newBase = Object.assign(base, {"sendTo": this.sendTo});
        }
        if (this.sender) {
            newBase = Object.assign(base, {"sender": this.sender});
        }
        return newBase; 
    }
}

enum NotificationTypes {
    Update,
    Read,
    Create,
    Delete,
    Write
}

export class NotificationMessage {
    id: string
    type: NotificationTypes 
    obj: string
    published: string
    target?: string
    state?: string

    constructor(id: string, type: NotificationTypes, obj: string, published?: string, target?: string, state?: string) {
        this.id = id;
        this.type = type;
        this.obj = obj;
        this.published = published || this._getCurrentDateString();
        this.target = target;
        this.state = state;
    }

    _getCurrentDateString = () => {
        return new Date().toISOString();
    }

    getContext = () => {
        let base = {
            "@context": [notificationContext, activityStreamsContext],
            "id": this.id,
            "type": this.type,
            "object": this.obj,
            "published": this.published,
        }
        let newBase = base;
        if (this.target) {
            newBase = Object.assign(base, {"target": this.target})
        }
        if (this.state) {
            newBase = Object.assign(base, {"state": this.state});
        }
        return newBase
    }
}