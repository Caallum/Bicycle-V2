import BaseEvent from "../structures/BaseEvent.js"
import Logger from "../Logger.js"

export default class GuildMemberRemoveEvent extends BaseEvent {
    constructor() {
        super("guildMemberRemove")
    }

    async run(client, member) {
        return client.log.MemberRemove(member)
    }
}