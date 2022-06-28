import { SlashCommandBuilder } from "@discordjs/builders";
import BaseCommand from "../../structures/BaseCommand.js";

export default class QueueCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("queue")
                .setDescription("Display current player's music queue"),   
        )
    }

    async run(interaction) {
        await interaction.client.player.queue(interaction);
    }
}