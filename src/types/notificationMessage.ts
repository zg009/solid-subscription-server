import { NotificationTypes, notificationContext, activityStreamsContext } from "./utils.js"

export class NotificationMessage {
    id: string
    type: NotificationTypes 
    obj: string
    published: string
    target?: string
    state?: string

    constructor(id: string, type: NotificationTypes, obj: string, published?: string) {
        this.id = id;
        this.type = type;
        this.obj = obj;
        this.published = published || this._getCurrentDateString();
    }

    addState = (state: string) => {
        this.state = state
        return this
    }

    addTarget = (target: string) => {
        this.target = target
        return this
    }

    _getCurrentDateString = () => {
        return new Date().toISOString();
    }

    generateDoc = () => {
        let base = {
            "@context": [notificationContext, activityStreamsContext],
            "id": this.id,
            "type": this.type,
            "object": this.obj,
            "published": this.published
        }
        if (this.target) {
            Object.assign(base, {"target": this.target})
        }
        if (this.state) {
            Object.assign(base, {"state": this.state})
        }
        return base
    }
}