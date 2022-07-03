import { SlashCommandBuilder } from "@discordjs/builders";
import BaseCommand from "../../structures/BaseCommand.js";
import embed from "../../utils/embed.js"

export default class ClaimCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("claim")
                .setDescription("Claim a ticket"),
        )
    }

    async run(interaction) {
        return interaction.client.tickets.claimTicket(interaction);
    }
}