import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import BaseCommand from "../../structures/BaseCommand.js";

export default class UnmuteCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("unmute")
                .setDescription("Unmute a user")
                .addUserOption(
                    new SlashCommandUserOption()
                        .setName("target")
                        .setDescription("User you wish to unmute")
                        .setRequired(true)
                )
                .addStringOption(option => 
                        option.setName("reason")
                            .setDescription("Reason for unmuting this user")
                            .setRequired(true)
                ),
        )
    }

    async run(interaction) {
        await interaction.client.moderator.unmute(interaction);
    }
}