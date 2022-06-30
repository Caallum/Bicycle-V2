import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import BaseCommand from "../../structures/BaseCommand.js";

export default class UnbanCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("unban")
                .setDescription("Unban a user")
                .addStringOption(option =>
                        option.setName("target")
                            .setDescription("User you wish to unban")
                            .setRequired(true)
                )
                .addStringOption(option => 
                        option.setName("reason")
                            .setDescription("Reason for unbanning this user")
                            .setRequired(true)
                    ),
            true,
        )
    }

    async run(interaction) {
        await interaction.client.moderator.unban(interaction);
    }
}