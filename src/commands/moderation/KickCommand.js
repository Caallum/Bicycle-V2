import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import BaseCommand from "../../structures/BaseCommand.js";

export default class KickCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("kick")
                .setDescription("Kick a user")
                .addUserOption(
                    new SlashCommandUserOption()
                        .setName("target")
                        .setDescription("User you wish to punish")
                        .setRequired(true)
                )
                .addStringOption(option => 
                        option.setName("reason")
                            .setDescription("Reason for kicking this user")
                            .setRequired(true)
                    ),
            true,
        )
    }

    async run(interaction) {
        if(!await interaction.client.moderator._automod(interaction, "kick")) await interaction.client.moderator.kick(interaction);
    }
}