import BaseEvent from "../structures/BaseEvent.js"
import Logger from "../Logger.js"

export default class MessageDeleteEvent extends BaseEvent {
    constructor() {
        super("messageDelete")
    }

    async run(client, message) {
        return client.log.MessageDelete(message)
    }
}