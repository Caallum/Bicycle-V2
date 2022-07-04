import BaseEvent from "../structures/BaseEvent.js"
import Logger from "../Logger.js"

export default class GuildMemberUpdateEvent extends BaseEvent {
    constructor() {
        super("guildMemberUpdate")
    }

    async run(client, oldMember, newMember) {
        return client.log.MemberUpdate(oldMember, newMember)
    }
}