export const notificationContext = "https://www.w3.org/ns/solid/notification/v1";
export const activityStreamsContext = "https://www.w3.org/ns/activitystreams";
export class DescriptionResource {
    id;
    channels;
    subscriptions;
    constructor(id) {
        this.id = id;
        this.channels = [];
        this.subscriptions = [];
    }
    addChannel = (channel) => {
        this.channels.push(channel);
        return this;
    };
    addSubscription = (subscription) => {
        this.subscriptions.push(subscription);
        return this;
    };
    generateDoc = () => {
        let base = {
            "@context": [notificationContext],
            "id": this.id,
        };
        base;
        if (this.subscriptions) {
            Object.assign(base, { "subscription": this.subscriptions });
        }
        if (this.channels) {
            Object.assign(base, { "channel": this.channels });
        }
        return base;
    };
}
export var ChannelType;
(function (ChannelType) {
    ChannelType[ChannelType["WebSocketChannel2023"] = 0] = "WebSocketChannel2023";
    ChannelType[ChannelType["EventSourceChannel2023"] = 1] = "EventSourceChannel2023";
    ChannelType[ChannelType["LDNChannel2023"] = 2] = "LDNChannel2023";
    ChannelType[ChannelType["StreamingHTTPChannel2023"] = 3] = "StreamingHTTPChannel2023";
    ChannelType[ChannelType["WebhookChannel2023"] = 4] = "WebhookChannel2023";
})(ChannelType || (ChannelType = {}));
export class SubscriptionService {
    id;
    channelType;
    features;
    constructor(id, channelType) {
        this.id = id;
        this.channelType = channelType;
        this.features = {};
    }
    addFeatures = (feature) => {
        Object.assign(this.features, feature);
        return this;
    };
    generateDoc = () => {
        let base = {
            "@context": [notificationContext],
            "id": this.id,
            "channelType": this.channelType,
        };
        if (this.features) {
            Object.assign(base, { "feature": this.features });
        }
        return base;
    };
}
export class NotificationChannel {
    id;
    type;
    topics;
    features;
    receiveFrom;
    sendTo;
    sender;
    constructor(id, type, topic) {
        this.id = id;
        this.type = type;
        this.topics = [topic];
        this.features = {};
    }
    addFeature = (feature) => {
        Object.assign(this.features, feature);
        return this;
    };
    addSendTo = (sendTo) => {
        this.sendTo = sendTo;
        return this;
    };
    addReceiveFrom = (receiveFrom) => {
        this.receiveFrom = receiveFrom;
        return this;
    };
    addSender = (sender) => {
        this.sender = sender;
        return this;
    };
    generateDoc = () => {
        let base = {
            "@context": [notificationContext],
            "id": this.id,
            "type": this.type,
            "topic": this.topics
        };
        if (this.features) {
            Object.assign(base, this.features);
        }
        if (this.receiveFrom) {
            Object.assign(base, { "receiveFrom": this.receiveFrom });
        }
        if (this.sendTo) {
            Object.assign(base, { "sendTo": this.sendTo });
        }
        if (this.sender) {
            Object.assign(base, { "sender": this.sender });
        }
        return base;
    };
}
export var NotificationTypes;
(function (NotificationTypes) {
    NotificationTypes[NotificationTypes["Update"] = 0] = "Update";
    NotificationTypes[NotificationTypes["Read"] = 1] = "Read";
    NotificationTypes[NotificationTypes["Create"] = 2] = "Create";
    NotificationTypes[NotificationTypes["Delete"] = 3] = "Delete";
    NotificationTypes[NotificationTypes["Write"] = 4] = "Write";
})(NotificationTypes || (NotificationTypes = {}));
export class NotificationMessage {
    id;
    type;
    obj;
    published;
    target;
    state;
    constructor(id, type, obj, published) {
        this.id = id;
        this.type = type;
        this.obj = obj;
        this.published = published || this._getCurrentDateString();
    }
    addState = (state) => {
        this.state = state;
        return this;
    };
    addTarget = (target) => {
        this.target = target;
        return this;
    };
    _getCurrentDateString = () => {
        return new Date().toISOString();
    };
    getContext = () => {
        let base = {
            "@context": [notificationContext, activityStreamsContext],
            "id": this.id,
            "type": this.type,
            "object": this.obj,
            "published": this.published
        };
        if (this.target) {
            Object.assign(base, { "target": this.target });
        }
        if (this.state) {
            Object.assign(base, { "state": this.state });
        }
        return base;
    };
}
