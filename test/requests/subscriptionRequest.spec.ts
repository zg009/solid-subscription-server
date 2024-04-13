import { Request } from 'express';
import { SubscriptionRequest } from './../../src/requests/subscriptionRequest';
import { jest, expect } from "@jest/globals"

const mockValidateId = jest.fn().mockReturnValueOnce('')

describe('SubscriptionRequest type', () => {
    
    it('parses out the turtle body', async () => {
        const uri = 'http://localhost:6060/'
        const turtle = `@prefix loc: <http://localhost:6060/>.
@prefix v1: <https://www.w3.org/ns/solid/notification/v1/>.

loc:notification-channel
    v1:channelType \"0\";
    v1:id \"http://localhost:6060/notification-channel\";
    v1:topic \"http://localhost:6060/topic/profile\".
`
        const subscriptionRequest = new SubscriptionRequest()

        jest.spyOn(subscriptionRequest, 'parseTurtleBody')

        const store = await subscriptionRequest.parseTurtleBody(uri, turtle)

        expect(subscriptionRequest.parseTurtleBody).toHaveBeenCalledTimes(1);

        jest.spyOn(subscriptionRequest, 'validateId')
    
        const mockQuads = ''

        expect(subscriptionRequest.validateId(store)).toBe('')
    })
})