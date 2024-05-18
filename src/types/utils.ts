export const notificationContext = "https://www.w3.org/ns/solid/notification/v1"
export const activityStreamsContext = "https://www.w3.org/ns/activitystreams"

export enum NotificationTypes {
    Update = "Update",
    Read = "Read",
    Create = "Create",
    Delete = "Delete",
    Write = "Write"
}

export enum ChannelType {
    WebSocketChannel2023 = "WebSocketChannel2023",
    EventSourceChannel2023= "EventSourceChannel2023",
    LDNChannel2023= "LDNChannel2023",
    StreamingHTTPChannel2023= "StreamingHTTPChannel2023",
    WebhookChannel2023= "WebhookChannel2023"
}