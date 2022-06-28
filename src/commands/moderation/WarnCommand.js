import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import BaseCommand from "../../structures/BaseCommand.js";

export default class PingCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("warn")
                .setDescription("Warn a user")
                .addUserOption(
                    new SlashCommandUserOption()
                        .setName("target")
                        .setDescription("User you wish to punish")
                        .setRequired(true)
                )
                .addStringOption(option => 
                        option.setName("reason")
                            .setDescription("Reason for warning this user")
                            .setRequired(true)
                    ),
            true,
        )
    }

    async run(interaction) {
        await interaction.client.moderator.warn(interaction);
    }
}