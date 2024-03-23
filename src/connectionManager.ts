import { ChannelType } from "./index.ts";

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

    sendMessage(message: string) {
        if (this.active) {
            this.ws.send(message)
        }
    }

    toggle() {
        this.active = !this.active
    }
}

export class WebSocketConnectionManager {
    channelBundlers: ChannelBundler[]
    constructor() {
        this.channelBundlers = []
    }

    sendMessage(id: string, message: string) {
        const cb = this.channelBundlers.filter(cb => cb.id === id)
        if (cb.length > 0) {
            cb[0].sendMessage(message)
        } else {
            throw new Error(`channel with id ${id} is not active`)
        }
    }
}