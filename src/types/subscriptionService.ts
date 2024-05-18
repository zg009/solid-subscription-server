import { NotificationChannel } from "./notificationChannel.js"
import { ChannelType, notificationContext } from "./utils.js"
import express, { NextFunction, Request, Response } from "express"
import * as $rdf from 'rdflib'

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

    // generateDoc = () => {
    //     let base = {
    //         "@context": [notificationContext],
    //         "id": this.id,
    //         "channelType": this.channelType,
    //     }
    //     if (this.features) {
    //         Object.assign(base, {"feature": this.features})
    //     }
    //     return base
    // }

    createStore = (): $rdf.Store => {
        let kb = $rdf.graph()
        const nc = $rdf.Namespace(notificationContext)
        const it = kb.sym(this.id)
        kb.add(it, nc('channelType'), this.channelType)
        if (this.features) {
            for (const feature in this.features) {
                kb.add(it, nc('feature'), feature)
            }
        }
        return kb
    }

    constructTurtle = (): Promise<string> => {
        const kb = this.createStore()
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

    validateFromParams = (req: Request<{}, {}, NotificationChannel>) => {
        if (req.headers["content-type"] !== "application/ld+json") {
            throw new Error("cannot validate other types at the moment")
        }
        const body = req.body
        const {id, type: channelType, topics, ...features} = body
        if (!id || !channelType || topics.length < 1 || !this.isSupported(channelType)) {
            throw new Error("missing id or channelType parameter")
        }
        return body
    }

    // this handle method should probably be moved elsewhere
    handle = (req: Request, res: Response) => {
        try {
            const body = this.validateFromParams(req)
            const {id, type: channelType, topics, ...features} = body
            // how to handle multiple topics?
            // create multiple channels?
            // there probably needs to be validation against the uri/id on the resource server...
            const nc = new NotificationChannel(id, channelType, topics[0])
            for (const feature in features) {
                nc.addFeature(feature)
            }
        } catch (err) {
            res.status(422).send('failed to validate request payload')
        }
    }

    // dummy function, not sure where the impl should go
    isSupported(ct: ChannelType): boolean {
        return true
    }

    // async asTurtle(): Promise<string|Error> {
    //     // thanks jeff https://forum.solidproject.org/t/is-there-a-converter-between-json-ld-and-turtle-n3/1817
    //     let store = $rdf.graph()
    //     return new Promise((resolve, reject) => {
    //         $rdf.parse(JSON.stringify(this.generateDoc()), store, this.id, 'text/turtle', (error, kb) => {
    //             if (error) reject(new Error(`error in 'parse' of 'asTurtle': ${error}`))
    //             else $rdf.serialize(null, store, this.id, 'application/ld+json', (err, result) => {
    //                 if (err) reject(new Error(`error in 'serialize' of 'asTurtle': ${err}`))
    //                 else if (result === undefined) reject(new Error('error: serialize returned undefined'))
    //                 else resolve(result)
    //             })
    //         })
    //     })
        
    // }
}
