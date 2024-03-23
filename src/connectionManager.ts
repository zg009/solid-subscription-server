import { ChannelType, DescriptionResource, NotificationChannel, NotificationMessage, SubscriptionService } from "./index.ts";
import {v4 as uuidv4} from 'uuid'

class ChannelBundler {
    id: string
    url: string
    channelType: ChannelType
    ws: WebSocket
    active: boolean

    constructor(id: string, url: string, channelType: ChannelType) {
        this.id = id
        this.url = url
        this.channelType = channelType
        this.ws = new WebSocket(url)
        this.active = false
    }

    sendMessage(message: NotificationMessage) {
        if (this.active) {
            this.ws.send(JSON.stringify(message.getContext()))
        }
    }

    toggle() {
        this.active = !this.active
    }
}

export class WebSocketConnectionManager {
    channelBundlers: ChannelBundler[]
    uris: string[]

    constructor() {
        this.channelBundlers = []
        this.uris = []
    }

    getDescriptionResource(url: string): DescriptionResource {
        const notifChannel = 
            new NotificationChannel(`${url}.nc`, ChannelType.WebSocketChannel2023, url)
            .addReceiveFrom(`wss://localhost:8080/ncurl`)
        const subscriptionService = new SubscriptionService(`${url}.ss`, ChannelType.WebSocketChannel2023)
        const ds = new DescriptionResource(`${url}.description`)
        ds.addChannel(notifChannel)
        ds.addSubscription(subscriptionService)

        const cb = new ChannelBundler(uuidv4(), url, ChannelType.WebSocketChannel2023)
        cb.toggle()
        this.addChannelBundler(cb)
        
        return ds;
    }

    addChannelBundler(cb: ChannelBundler) {
        this.uris.push(cb.url)
        this.channelBundlers.push(cb)
    }

    sendMessage(id: string, message: NotificationMessage) {
        const cb = this.channelBundlers.filter(cb => cb.id === id)
        if (cb.length > 0) {
            cb[0].sendMessage(message)
        } else {
            throw new Error(`channel with id ${id} is not active`)
        }
    }
}