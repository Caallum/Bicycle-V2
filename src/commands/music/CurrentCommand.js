import { SlashCommandBuilder } from "@discordjs/builders";
import BaseCommand from "../../structures/BaseCommand.js";

export default class CurrentCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("current")
                .setDescription("Display the current song playing"),         
        )
    }

    async run(interaction) {
        await interaction.client.player.current(interaction);
    }
}