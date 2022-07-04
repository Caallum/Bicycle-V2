import BaseEvent from "../structures/BaseEvent.js"
import Logger from "../Logger.js"

export default class ChannelCreateEvent extends BaseEvent {
    constructor() {
        super("channelCreate")
    }

    async run(client, member) {
        return client.log.ChannelCreate(member)
    }
}