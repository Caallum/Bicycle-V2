import { SlashCommandBuilder } from "@discordjs/builders";
import BaseCommand from "../../structures/BaseCommand.js";

export default class SkipCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("skip")
                .setDescription("Skip the current song playing"),
        )
    }

    async run(interaction) {
        await interaction.client.player.skip(interaction);
    }
}