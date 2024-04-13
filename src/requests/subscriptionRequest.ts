import { Request, Response } from "express";
import { NotificationChannel } from "../types/notificationChannel.js";
import * as $rdf from "rdflib"

export class SubscriptionRequest {

    constructor() {}

    static handle(req: Request, res: Response) {
        // req.body.
    }
    
    async parseTurtleBody(uri: string, body: string): Promise<$rdf.Formula|null> {
        return new Promise((resolve, reject) => {
            let store = $rdf.graph()
            $rdf.parse(body, store, uri, 'text/turtle', (err, store) => {
                if (err) reject(null)
                resolve(store)
            })
        })
    }

    validateId = (store: $rdf.Store) => {
        const NOTIF = $rdf.Namespace("https://www.w3.org/ns/solid/notification/v1/")
        let quads = store.match(null, NOTIF('id'))
        return quads
    }
}