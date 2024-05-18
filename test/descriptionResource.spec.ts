import { afterAll, beforeAll, expect } from "@jest/globals"
import { DescriptionResource } from '../src/types/descriptionResource';
import { NotificationChannel } from "../src/types/notificationChannel";
import { SubscriptionService } from "../src/types/subscriptionService";
import { ChannelType } from "../src/types/utils";
import { mkdirSync, rmdirSync } from "node:fs";

const TEMP_FOLDER = './resources/'
describe('DescriptionResource type', () => {
    let dr: DescriptionResource;
    let id: string;
    let channels: NotificationChannel[]
    let subscriptions: SubscriptionService[]
    
    beforeAll(() => {
        const ncid = "http://localhost:6060/notification-channel"
        const topic = "http://localhost:6060/topic/profile"
        let channelType = ChannelType.WebSocketChannel2023
        const nc = new NotificationChannel(ncid, channelType, topic)
        channels.push(nc)

        const ssid = "http://localhost:6060/subscription-service.ttl"
        channelType = ChannelType.WebSocketChannel2023
        const ss = new SubscriptionService(ssid, channelType)
        subscriptions.push(ss)

        
        mkdirSync(TEMP_FOLDER)
    })

    afterAll(() => {
        rmdirSync(TEMP_FOLDER)
    })

    it('creates a new descriptionResource doc', () => {
        
    })

})