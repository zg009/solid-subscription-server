"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationMessage = exports.NotificationTypes = exports.NotificationChannel = exports.SubscriptionService = exports.ChannelType = exports.DescriptionResource = exports.activityStreamsContext = exports.notificationContext = void 0;
exports.notificationContext = "https://www.w3.org/ns/solid/notification/v1";
exports.activityStreamsContext = "https://www.w3.org/ns/activitystreams";
class DescriptionResource {
    constructor(id) {
        this.addChannel = (channel) => {
            this.channels.push(channel);
            return this;
        };
        this.addSubscription = (subscription) => {
            this.subscriptions.push(subscription);
            return this;
        };
        this.generateDoc = () => {
            let base = {
                "@context": [exports.notificationContext],
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
        this.id = id;
        this.channels = [];
        this.subscriptions = [];
    }
}
exports.DescriptionResource = DescriptionResource;
var ChannelType;
(function (ChannelType) {
    ChannelType[ChannelType["WebSocketChannel2023"] = 0] = "WebSocketChannel2023";
    ChannelType[ChannelType["EventSourceChannel2023"] = 1] = "EventSourceChannel2023";
    ChannelType[ChannelType["LDNChannel2023"] = 2] = "LDNChannel2023";
    ChannelType[ChannelType["StreamingHTTPChannel2023"] = 3] = "StreamingHTTPChannel2023";
    ChannelType[ChannelType["WebhookChannel2023"] = 4] = "WebhookChannel2023";
})(ChannelType || (exports.ChannelType = ChannelType = {}));
class SubscriptionService {
    constructor(id, channelType) {
        this.addFeatures = (feature) => {
            Object.assign(this.features, feature);
            return this;
        };
        this.generateDoc = () => {
            let base = {
                "@context": [exports.notificationContext],
                "id": this.id,
                "channelType": this.channelType,
            };
            if (this.features) {
                Object.assign(base, { "feature": this.features });
            }
            return base;
        };
        this.id = id;
        this.channelType = channelType;
        this.features = {};
    }
}
exports.SubscriptionService = SubscriptionService;
class NotificationChannel {
    constructor(id, type, topic) {
        this.addFeature = (feature) => {
            Object.assign(this.features, feature);
            return this;
        };
        this.addSendTo = (sendTo) => {
            this.sendTo = sendTo;
            return this;
        };
        this.addReceiveFrom = (receiveFrom) => {
            this.receiveFrom = receiveFrom;
            return this;
        };
        this.addSender = (sender) => {
            this.sender = sender;
            return this;
        };
        this.generateDoc = () => {
            let base = {
                "@context": [exports.notificationContext],
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
        this.id = id;
        this.type = type;
        this.topics = [topic];
        this.features = {};
    }
}
exports.NotificationChannel = NotificationChannel;
var NotificationTypes;
(function (NotificationTypes) {
    NotificationTypes[NotificationTypes["Update"] = 0] = "Update";
    NotificationTypes[NotificationTypes["Read"] = 1] = "Read";
    NotificationTypes[NotificationTypes["Create"] = 2] = "Create";
    NotificationTypes[NotificationTypes["Delete"] = 3] = "Delete";
    NotificationTypes[NotificationTypes["Write"] = 4] = "Write";
})(NotificationTypes || (exports.NotificationTypes = NotificationTypes = {}));
class NotificationMessage {
    constructor(id, type, obj, published) {
        this.addState = (state) => {
            this.state = state;
            return this;
        };
        this.addTarget = (target) => {
            this.target = target;
            return this;
        };
        this._getCurrentDateString = () => {
            return new Date().toISOString();
        };
        this.getContext = () => {
            let base = {
                "@context": [exports.notificationContext, exports.activityStreamsContext],
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
        this.id = id;
        this.type = type;
        this.obj = obj;
        this.published = published || this._getCurrentDateString();
    }
}
exports.NotificationMessage = NotificationMessage;
