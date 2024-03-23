class ChannelBundler {
    id;
    url;
    channelType;
    ws;
    active;
    constructor(id, url, channelType) {
        this.id = id;
        this.url = url;
        this.channelType = channelType;
        this.ws = new WebSocket(url);
        this.active = false;
    }
    sendMessage(message) {
        if (this.active) {
            this.ws.send(message);
        }
    }
    toggle() {
        this.active = !this.active;
    }
}
export class WebSocketConnectionManager {
    channelBundlers;
    constructor() {
        this.channelBundlers = [];
    }
    sendMessage(id, message) {
        const cb = this.channelBundlers.filter(cb => cb.id === id);
        if (cb.length > 0) {
            cb[0].sendMessage(message);
        }
        else {
            throw new Error(`channel with id ${id} is not active`);
        }
    }
}
