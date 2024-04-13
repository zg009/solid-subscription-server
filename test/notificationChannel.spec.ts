import { expect } from "@jest/globals"
import { NotificationChannel } from "../src/types/notificationChannel"
import { ChannelType } from "../src/types/utils";

describe('NotificationChannel type', () => {
    let nc: NotificationChannel;
    let id: string;
    let topic: string;
    let channelType: ChannelType;

    beforeEach(() => {
        id = "http://localhost:6060/notification-channel"
        topic = "http://localhost:6060/topic/profile"
        channelType = ChannelType.WebSocketChannel2023
        nc = new NotificationChannel(id, channelType, topic)
    })

    it('creates a new NotificationChannel doc', async () => {
        const ncDoc = {}
        const actual = await nc.generateDoc()

        expect(actual).toEqual(ncDoc)
    })
})