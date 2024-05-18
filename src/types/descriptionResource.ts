import { notificationContext } from "./utils.js"
import { NotificationChannel } from "./notificationChannel.js"
import { SubscriptionService } from "./subscriptionService.js"
import { writeFile } from "node:fs/promises"
import * as $rdf from 'rdflib'


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

    // generateDoc = () => {
    //     let base = {
    //         "@context": [notificationContext],
    //         "id": this.id,
    //     }
    //     if (this.subscriptions) {
    //         base = Object.assign(base, {subscription : this.subscriptions})
    //     }
    //     if (this.channels) {
    //         base = Object.assign(base, {channel : this.channels})
    //     }

    //     return base;
    // }

    createStore = async (): Promise<$rdf.Store> => {
        let kb = $rdf.graph()
        const nc = $rdf.Namespace(notificationContext)
        const it = kb.sym(this.id)
        if (this.channels) {
            for (const channel of this.channels) {
                const ttl = await channel.generateDoc()
                kb.add(it, nc('channel'), ttl)
            }
        }
        if (this.subscriptions) {
            for (const subscription of this.subscriptions) {
                // kb = kb + subscription.createStore()
                const ttl = await subscription.constructTurtle()
                kb.add(it, nc('subscription'), ttl)
            }
        }
        return kb
    }

    constructTurtle = async (): Promise<string> =>  {
        const kb = await this.createStore()
        return new Promise((resolve, reject) => {
            $rdf.serialize(null, kb, undefined, 'text/turtle', (err, res) => {
                if (err || (res === undefined)) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
        
    }

    writeToFileSystem = async (relativePath: string, fullPath?: string) => {
        try {
            const out = await this.constructTurtle()
            if (fullPath) {
                await writeFile(fullPath, out)
                return;
            }
            await writeFile(relativePath, out)
            return
        } catch (err: any) {
            console.error(err)
        }
    }
}