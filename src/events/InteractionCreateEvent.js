import Logger from "../Logger.js";
import BaseEvent from "../structures/BaseEvent.js";
import embed from "../utils/embed.js"

export default class InteractionCreateEvent extends BaseEvent {
    constructor() {
        super("interactionCreate");
    }

    async run(client, interaction) {
        if(!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if(!command) return;

        try {
            await command.run(interaction);
        } catch(error) {
            new embed(interaction, {
                title: `Error occured`,
                description: `Something went wrong! Please contact the developer to look into this issue.`
            })
            new Logger({
                error: true,
                message: `An error has occured: ${error}`
            })
        }
    }
}