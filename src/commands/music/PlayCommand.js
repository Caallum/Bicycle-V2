import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import BaseCommand from "../../structures/BaseCommand.js";

export default class PlayCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("play")
                .setDescription("Play a song!")
                .addStringOption(
                    new SlashCommandStringOption()
                        .setName("query")
                        .setDescription("The query you wish to search for")
                        .setRequired(true)
                )
        )
    }

    async run(interaction) {
        await interaction.client.player.play(interaction);
    }
}