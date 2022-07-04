import BaseEvent from "../structures/BaseEvent.js"
import Logger from "../Logger.js"

export default class RoleUpdateEvent extends BaseEvent {
    constructor() {
        super("roleUpdate")
    }

    async run(client, oldRole, newRole) {
        return client.log.RoleUpdate(oldRole, newRole)
    }
}