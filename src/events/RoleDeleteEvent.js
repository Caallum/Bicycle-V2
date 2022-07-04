import BaseEvent from "../structures/BaseEvent.js"
import Logger from "../Logger.js"

export default class RoleDeleteEvent extends BaseEvent {
    constructor() {
        super("roleDelete")
    }

    async run(client, role) {
        return client.log.RoleDelete(role)
    }
}