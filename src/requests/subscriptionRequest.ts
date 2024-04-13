import { Request, Response } from "express";
import { NotificationChannel } from "../types/notificationChannel.js";
import * as $rdf from "rdflib"

export class SubscriptionRequest {

    constructor() {}

    /**
     * 
     * @param req express request
     * @param res express responde
     */
    // TODO: check content-type/accept headers for response validation
    static handle(req: Request, res: Response) {
        // req.body.
    }
    
    /**
     * 
     * @param uri base uri, will probably inherit from handler req.url || req.hostname
     * @param body req.body
     * @returns null if parsing of turtle body fails
     * 
     */
    async parseTurtleBody(uri: string, body: string): Promise<$rdf.Formula|null> {
        return new Promise((resolve, reject) => {
            let store = $rdf.graph()
            $rdf.parse(body, store, uri, 'text/turtle', (err, store) => {
                if (err) reject(null)
                resolve(store)
            })
        })
    }

    /**
     * one notification channel MUST HAVE one id (probably reflective uri)
     * @param store rdf graph
     * @returns TODO
     */
    validateId = (store: $rdf.IndexedFormula) => {
        const NOTIF = $rdf.Namespace("https://www.w3.org/ns/solid/notification/v1/")
        let quads = store.match(null, NOTIF('id')).map(statement => statement.subject)
        return quads
    }
}