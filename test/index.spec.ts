import { ChannelType, DescriptionResource, SubscriptionService, notificationContext } from "../src/index.ts";
import { expect } from "chai";

describe('tests index types', () => {
    context('DescriptionResource type', () => {

        let id: string
        let ds: DescriptionResource
        let dsDoc: Object
        beforeEach(() => {
            id = "http://localhost:8080/myresource.ttl"
            ds = new DescriptionResource(id);
            dsDoc = {
                "@context": [notificationContext],
                "id": id
            }
        })

        it('tests a new DescriptionResource document', () => {
            
            expect(dsDoc).to.deep.equal(ds.generateDoc())
        })

        // it('tests adding a channel', () => {
            
        // })
    })

    context('SubscriptionService type', () => {
        let ss: SubscriptionService
        let id: string
        let channelType: ChannelType
        
        beforeEach(() => {
            id = "http://localhost:6060/subscription-service.ttl"
            channelType = ChannelType.WebSocketChannel2023
            ss = new SubscriptionService(id, channelType)
        })

        it('creates a new SubscriptionService doc', () => {
            const ssDoc = {
                "@context": [notificationContext],
                "id": id,
                "channelType": channelType,
            }

            expect(ss.generateDoc()).to.deep.equal(ssDoc)
        })
    })
    
})