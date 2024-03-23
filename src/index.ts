export const notificationContext = "https://www.w3.org/ns/solid/notification/v1"
export const activityStreamsContext = "https://www.w3.org/ns/activitystreams"

type Channel = {
    channel: string;
}

type Subscription = {
    subscription: string;
}

export class DescriptionResource {
    id: string
    channels: Channel[]
    subscriptions: Subscription[]
    
    constructor(id: string) {
        this.id = id
        this.channels = []
        this.subscriptions = []
    }

    addChannel = (channel: Channel) => {
        this.channels.push(channel)
        return this
    }

    addSubscription = (subscription: Subscription) => {
        this.subscriptions.push(subscription)
        return this
    }

    generateDoc = () => {
        let base = {
            "@context": [notificationContext],
            "id": this.id,
        }
        base;
        if (this.subscriptions) {
            Object.assign(base, {"subscription" : this.subscriptions})
        }
        if (this.channels) {
            Object.assign(base, {"channel" : this.channels})
        }

        return base;
    }
}

export enum ChannelType {
    WebSocketChannel2023,
    EventSourceChannel2023,
    LDNChannel2023,
    StreamingHTTPChannel2023,
    WebhookChannel2023
}

export class SubscriptionService {
    id: string
    channelType: ChannelType
    features: Object

    constructor(id: string, channelType: ChannelType) {
        this.id = id
        this.channelType = channelType
        this.features = {}
    }

    addFeatures = (feature: Object) => {
        Object.assign(this.features, feature)
        return this
    }

    generateDoc = () => {
        let base = {
            "@context": [notificationContext],
            "id": this.id,
            "channelType": this.channelType,
        }
        if (this.features) {
            Object.assign(base, {"feature": this.features})
        }
        return base
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

    constructor(id: string, type: ChannelType, topic: string ) {
        this.id = id
        this.type = type
        this.topics = [topic]
        this.features = {}
    }

    addFeature = (feature: Object) => {
        Object.assign(this.features, feature)
        return this
    }

    addSendTo = (sendTo: string) => {
        this.sendTo = sendTo
        return this
    }

    addReceiveFrom = (receiveFrom: string) => {
        this.receiveFrom = receiveFrom
        return this
    }

    addSender = (sender: string) => {
        this.sender = sender
        return this
    }

    generateDoc = () => {
        let base = {
            "@context": [notificationContext],
            "id": this.id,
            "type": this.type,
            "topic": this.topics
        }
        if (this.features) {
            Object.assign(base, this.features)
        }
        if (this.receiveFrom) {
            Object.assign(base, {"receiveFrom": this.receiveFrom})
        }
        if (this.sendTo) {
            Object.assign(base, {"sendTo": this.sendTo})
        }
        if (this.sender) {
            Object.assign(base, {"sender": this.sender})
        }
        return base 
    }
}

export enum NotificationTypes {
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

    constructor(id: string, type: NotificationTypes, obj: string, published?: string) {
        this.id = id;
        this.type = type;
        this.obj = obj;
        this.published = published || this._getCurrentDateString();
    }

    addState = (state: string) => {
        this.state = state
        return this
    }

    addTarget = (target: string) => {
        this.target = target
        return this
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
            "published": this.published
        }
        if (this.target) {
            Object.assign(base, {"target": this.target})
        }
        if (this.state) {
            Object.assign(base, {"state": this.state})
        }
        return base
    }
}