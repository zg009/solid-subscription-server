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
        const ncDoc = `@prefix loc: <http://localhost:6060/>.
@prefix v1: <https://www.w3.org/ns/solid/notification/v1/>.

loc:notification-channel
    v1:channelType \"WebSocketChannel2023\";
    v1:id \"http://localhost:6060/notification-channel\";
    v1:topic \"http://localhost:6060/topic/profile\".
`
        const actual = await nc.generateDoc()

        expect(actual).toEqual(ncDoc)
    })
})