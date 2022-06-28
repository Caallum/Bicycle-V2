import BaseEvent from "../structures/BaseEvent.js"
import Logger from "../Logger.js"

export default class ReadyEvent extends BaseEvent {
    constructor() {
        super("ready")
    }

    async run(client) {
        new Logger({
            info: true,
            message: `${client.user.tag} is ready`
        });

        client.user.setActivity(`over Bicycle`, { type: "WATCHING" })
    }
}