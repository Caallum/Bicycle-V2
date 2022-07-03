import { SlashCommandBuilder } from "@discordjs/builders";
import BaseCommand from "../../structures/BaseCommand.js";
import embed from "../../utils/embed.js"

export default class CloseCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("close")
                .setDescription("Close a ticket"),
        )
    }

    async run(interaction) {
        return interaction.client.tickets.closeTicket(interaction);
    }
}