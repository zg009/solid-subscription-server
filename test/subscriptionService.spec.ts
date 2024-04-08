import { SubscriptionService } from '../src/types/subscriptionService';
import { ChannelType, notificationContext } from "../src/types/utils";
import {expect } from "@jest/globals"

describe('SubscriptionService type', () => {
    let ss: SubscriptionService;
    let id: string;
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

        expect(ss.generateDoc()).toEqual(ssDoc)
    })

    // it.skip('returns a turtle representation of the subscriptionService', async () => {
    //     const ssDoc = {

    //     }
    //     expect(await ss.asTurtle()).toEqual(ssDoc)
    // })
})
    
