import { SlashCommandBuilder, SlashCommandNumberOption } from "@discordjs/builders";
import BaseCommand from "../../structures/BaseCommand.js";

export default class VolumeCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("volume")
                .setDescription("Set the current player's volume")
                .addNumberOption(
                    new SlashCommandNumberOption()
                        .setName("percentage")
                        .setMaxValue(200)
                        .setMinValue(0)
                        .setRequired(true)
                        .setDescription("What percentage you want the volume to be set")
                ),
            true
            
        )
    }

    async run(interaction) {
        await interaction.client.player.volume(interaction);
    }
}