import { SlashCommandBuilder } from "@discordjs/builders";
import BaseCommand from "../../structures/BaseCommand.js";

export default class ResumeCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("resume")
                .setDescription("Resume the music player"),
        )
    }

    async run(interaction) {
        await interaction.client.player.resume(interaction);
    }
}