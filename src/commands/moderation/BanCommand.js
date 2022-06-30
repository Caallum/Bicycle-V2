import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import BaseCommand from "../../structures/BaseCommand.js";

export default class BanCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("ban")
                .setDescription("Ban a user")
                .addUserOption(
                    new SlashCommandUserOption()
                        .setName("target")
                        .setDescription("User you wish to punish")
                        .setRequired(true)
                )
                .addStringOption(option => 
                        option.setName("reason")
                            .setDescription("Reason for banning this user")
                            .setRequired(true)
                    ),
            true,
        )
    }

    async run(interaction) {
        await interaction.client.moderator.ban(interaction);
    }
}