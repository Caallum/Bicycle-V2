import BaseEvent from "../structures/BaseEvent.js"
import Logger from "../Logger.js"

export default class GuildMemberAddEvent extends BaseEvent {
    constructor() {
        super("guildMemberAdd")
    }

    async run(client, member) {
        return client.log.MemberAdd(member)
    }
}