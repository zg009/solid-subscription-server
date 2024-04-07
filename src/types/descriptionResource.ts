import { notificationContext } from "./utils.js"
import { NotificationChannel } from "./notificationChannel.js"
import { SubscriptionService } from "./subscriptionService.js"


export class DescriptionResource {
    id: string
    channels?: NotificationChannel[]
    subscriptions?: SubscriptionService[]
    
    constructor(id: string) {
        this.id = id
    }

    addChannel = (channel: NotificationChannel) => {
        if (!this.channels) {
            this.channels = []
        }
        this.channels.push(channel)
        return this
    }

    addSubscription = (subscription: SubscriptionService) => {
        if (!this.subscriptions) {
            this.subscriptions = []
        }
        this.subscriptions.push(subscription)
        return this
    }

    generateDoc = () => {
        let base = {
            "@context": [notificationContext],
            "id": this.id,
        }
        if (this.subscriptions) {
            Object.assign(base, {"subscription" : this.subscriptions})
        }
        if (this.channels) {
            Object.assign(base, {"channel" : this.channels})
        }

        return base;
    }
}