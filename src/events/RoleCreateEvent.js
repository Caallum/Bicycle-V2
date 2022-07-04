import BaseEvent from "../structures/BaseEvent.js"
import Logger from "../Logger.js"

export default class RoleCreateEvent extends BaseEvent {
    constructor() {
        super("roleCreate")
    }

    async run(client, role) {
        return client.log.RoleCreate(role)
    }
}