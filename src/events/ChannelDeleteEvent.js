import BaseEvent from "../structures/BaseEvent.js"
import Logger from "../Logger.js"

export default class ChannelDeleteEvent extends BaseEvent {
    constructor() {
        super("channelDelete")
    }

    async run(client, member) {
        return client.log.ChannelDelete(member)
    }
}