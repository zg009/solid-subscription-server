import { ChannelType, notificationContext } from "./utils.js"
import * as $rdf from "rdflib"
import { ContextDefinition, compact } from "jsonld"

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

    generateDoc = () => {
        let base = {
            "@context": [notificationContext],
            "id": this.id,
            "channelType": this.channelType,
        }
        if (this.features) {
            Object.assign(base, {"feature": this.features})
        }
        return base
    }

    async asTurtle(): Promise<string|Error> {
        // thanks jeff https://forum.solidproject.org/t/is-there-a-converter-between-json-ld-and-turtle-n3/1817
        let store = $rdf.graph()
        return new Promise((resolve, reject) => {
            $rdf.parse(JSON.stringify(this.generateDoc()), store, this.id, 'text/turtle', (error, kb) => {
                if (error) reject(new Error(`error in 'parse' of 'asTurtle': ${error}`))
                else $rdf.serialize(null, store, this.id, 'application/ld+json', (err, result) => {
                    if (err) reject(new Error(`error in 'serialize' of 'asTurtle': ${err}`))
                    else if (result === undefined) reject(new Error('error: serialize returned undefined'))
                    else resolve(result)
                })
            })
        })
        
    }
}
