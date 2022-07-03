import { SlashCommandBuilder } from "@discordjs/builders";
import BaseCommand from "../../structures/BaseCommand.js";
import embed from "../../utils/embed.js"

export default class InformationCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("information")
                .setDescription("View information of a ticket"),
        )
    }

    async run(interaction) {
        return interaction.client.tickets.ticketInformation(interaction);
    }
}