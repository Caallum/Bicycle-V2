import Logger from "../Logger.js";
import BaseEvent from "../structures/BaseEvent.js";
import embed from "../utils/embed.js"
import BicycleConfig from "../Bicycle.Config.js";
import BicycleTicket from "../Bicycle.Tickets.js"

export default class InteractionCreateEvent extends BaseEvent {
    constructor() {
        super("interactionCreate");
    }

    async run(client, interaction) {
        if(interaction.isSelectMenu()) {
            if(interaction.customId != "ticketMenu") return;
            let value = interaction.values[0];
            value = value.split("-")[1];
            value = BicycleConfig.other.tickets.options[parseInt(value)]

            return client.tickets.handle(interaction, value.name.toLowerCase())
        }

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