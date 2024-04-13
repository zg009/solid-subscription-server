import { ChannelType, notificationContext } from "./utils.js"
import * as $rdf from "rdflib"

export class NotificationChannel {
    id: string
    type: ChannelType
    topics: string[]
    features?: Object
    receiveFrom?: string 
    sendTo?: string
    sender?: string

    constructor(id: string, type: ChannelType, topic: string ) {
        this.id = id
        this.type = type
        this.topics = [topic]
    }

    addFeature = (feature: Object) => {
        if (!this.features) {
            this.features = {}
        }
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
        const node = store.sym(this.id)
        store.add(node, NOTIF("id"), $rdf.literal(this.id))
        store.add(node, NOTIF("channelType"), $rdf.literal(this.type.toString()))
        for (const topic of this.topics) {
            store.add(node, NOTIF('topic'), topic)
        }
        if (this.sender) {
            store.add(node, NOTIF('sender'), $rdf.literal(this.sender))
        }
        if (this.sendTo) {
            store.add(node, NOTIF('sendTo'), $rdf.literal(this.sendTo))
        }
        if (this.receiveFrom) {
            store.add(node, NOTIF('receiveFrom'), $rdf.literal(this.receiveFrom))
        }
        if (this.features) {
            for (const feature in Object.keys(this.features)) {
                // @ts-ignore
                const g = this.features[feature]
                store.add(node, NOTIF(`${feature}`), $rdf.literal(g))
            }
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
