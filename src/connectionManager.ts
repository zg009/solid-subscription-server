import { ChannelType } from './types/utils.js'
import { NotificationMessage } from './types/notificationMessage.js'
import { v4 as uuidv4 } from 'uuid'
import { WebSocket, WebSocketServer } from 'ws'
import { NotificationChannel } from './types/notificationChannel.js'

class LiveSolidSocket {
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
        this.wsUrl = wsUrl
        this.active = false
    }

    static createFromNotificationChannelDoc = (nc: NotificationChannel) => {
        const {id: url, type: channelType, topics, ...features} = nc
        // better way to determine http/https vs ws/wss in future
        const cb = new LiveSolidSocket(uuidv4(), url, url.replace('http', 'ws'), channelType)
        return cb
    }

    sendMessage(message: NotificationMessage) {
        if (this.active && this.ws) {
            // console.log(message.generateDoc())
            this.ws.send(JSON.stringify(message.generateDoc()))
        }
    }

    toggle() {
        
        if (!this.active) {
            this.ws = new WebSocket(this.wsUrl)
        } else {
            this.ws!!.close()
        }
        this.active = !this.active
        
    }
}

export class WebSocketConnectionManager {
    liveSockets: LiveSolidSocket[]
    uris: string[]
    socketServer: WebSocketServer

    constructor(port?: number) {
        this.liveSockets = []
        this.uris = []
        const conn = port ? port : 6060
        this.socketServer = new WebSocketServer({ port: conn })
        this.socketServer.on('connection', function connection(ws) {
            // console.log(ws)
            
            ws.on('error', console.error);
          
            ws.on('message', function message(data) {
              console.log('received: %s', data);
            });
          
          });
    }

    // getDescriptionResource(url: string): DescriptionResource {
        
    //     const cb = new ChannelBundler(uuidv4(), url, `ws://localhost:6060`, ChannelType.WebSocketChannel2023)
    //     console.log(`channelbundler url: ${cb.url}`)
    //     cb.toggle()
    //     this.addChannelBundler(cb)
    //     console.log(`${cb.active}`)
    //     // return ds;
    // }

    addChannelBundler(cb: LiveSolidSocket) {
        this.uris.push(cb.url)
        this.liveSockets.push(cb)
    }

    sendMessage(id: string, message: NotificationMessage) {
        console.log(`sendMessage id: ${id}`)
        const targetSocket = this.liveSockets.filter(ls => {
            // console.log(`\tfilter id: ${ls.url}`)
            return ls.url === id
        })
        console.log(targetSocket.length)
        if (targetSocket.length > 0) {
            targetSocket[0].sendMessage(message)
        } else {
            throw new Error(`channel with id ${id} is not active`)
        }
    }
}