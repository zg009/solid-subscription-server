import { ChannelType, notificationContext } from "./utils.js"

export class SubscriptionService {
    id: string
    channelType: ChannelType
    features?: string[]

    constructor(id: string, channelType: ChannelType) {
        this.id = id
        this.channelType = channelType
    }

    addFeatures = (feature: string) => {
        if (!this.features) {
            this.features = []
        }
        this.features.push(feature)
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
