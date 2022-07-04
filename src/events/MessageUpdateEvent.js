import BaseEvent from "../structures/BaseEvent.js"
import Logger from "../Logger.js"

export default class MessageUpdateEvent extends BaseEvent {
    constructor() {
        super("messageUpdate")
    }

    async run(client, oldMessage, newMessage) {
        return client.log.MessageEdit(oldMessage, newMessage)
    }
}