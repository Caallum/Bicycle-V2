import { SlashCommandBuilder } from "@discordjs/builders";
import BaseCommand from "../../structures/BaseCommand.js";

export default class LeaveCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("leave")
                .setDescription("Leave the current voice channel"),
            true
        )
    }

    async run(interaction) {
        await interaction.client.player.leave(interaction);
    }
}