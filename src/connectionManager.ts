import { ChannelType } from './types/utils.js'
import { NotificationMessage } from './types/notificationMessage.js'
import { v4 as uuidv4 } from 'uuid'
import { WebSocket, WebSocketServer } from 'ws'

class ChannelBundler {
    id: string
    url: string
    channelType: ChannelType
    ws?: WebSocket
    wss?: WebSocketServer
    wsUrl: string
    active: boolean

    constructor(id: string, url: string, wsUrl: string, channelType: ChannelType) {
        this.id = id
        this.url = url
        this.channelType = channelType
        // this.ws = new WebSocket(wsUrl)
        this.wsUrl = wsUrl
        this.active = false
    }

    sendMessage(message: NotificationMessage) {
        if (this.active && this.ws) {
            // console.log(message.generateDoc())
            this.ws.send(JSON.stringify(message.generateDoc()))
        }
    }

    toggle() {
        this.wss = new WebSocketServer({ port:6060 })
        this.wss.on('connection', function connection(ws) {
            // console.log(ws)
            
            ws.on('error', console.error);
          
            ws.on('message', function message(data) {
              console.log('received: %s', data);
            });
          
          });
        this.ws = new WebSocket(this.wsUrl)
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

    // getDescriptionResource(url: string): DescriptionResource {
        
    //     const cb = new ChannelBundler(uuidv4(), url, `ws://localhost:6060`, ChannelType.WebSocketChannel2023)
    //     console.log(`channelbundler url: ${cb.url}`)
    //     cb.toggle()
    //     this.addChannelBundler(cb)
    //     console.log(`${cb.active}`)
    //     // return ds;
    // }

    addChannelBundler(cb: ChannelBundler) {
        this.uris.push(cb.url)
        this.channelBundlers.push(cb)
    }

    sendMessage(id: string, message: NotificationMessage) {
        console.log(`sendMessage id: ${id}`)
        const cb = this.channelBundlers.filter(cb => {
            console.log(`\tfilter id: ${cb.url}`)
            return cb.url === id
        })
        console.log(cb.length)
        if (cb.length > 0) {
            cb[0].sendMessage(message)
        } else {
            throw new Error(`channel with id ${id} is not active`)
        }
    }
}