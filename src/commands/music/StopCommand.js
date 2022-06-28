import { SlashCommandBuilder } from "@discordjs/builders";
import BaseCommand from "../../structures/BaseCommand.js";

export default class stopCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("stop")
                .setDescription("Stop the music player"),
        )
    }

    async run(interaction) {
        await interaction.client.player.stop(interaction);
    }
}