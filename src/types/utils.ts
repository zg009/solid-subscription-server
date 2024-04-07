export const notificationContext = "https://www.w3.org/ns/solid/notification/v1"
export const activityStreamsContext = "https://www.w3.org/ns/activitystreams"

export enum NotificationTypes {
    Update,
    Read,
    Create,
    Delete,
    Write
}

export enum ChannelType {
    WebSocketChannel2023,
    EventSourceChannel2023,
    LDNChannel2023,
    StreamingHTTPChannel2023,
    WebhookChannel2023
}