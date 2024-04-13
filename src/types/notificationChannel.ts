import { ChannelType, notificationContext } from "./utils.js"
import * as $rdf from "rdflib"

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

    generateDoc = async () => {
        let store = $rdf.graph()
        const NOTIF = $rdf.Namespace("https://www.w3.org/ns/solid/notification/v1/")
        const node = $rdf.sym(this.id);
        store.add(node, NOTIF("id"), $rdf.literal(this.id))
        store.add(node, NOTIF("channelType"), $rdf.literal(this.type.toString()))
        for (const topic of this.topics) {
            store.add(node, NOTIF('topic'), topic)
        }
        return new Promise((resolve, reject) => {
            $rdf.serialize(null, store, null, 'text/turtle', (err, str) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(str)
                }
            })
        })
        
    }

}
