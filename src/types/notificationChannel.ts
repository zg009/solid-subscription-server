import { ChannelType, notificationContext } from "./utils.js"

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
