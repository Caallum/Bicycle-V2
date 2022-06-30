import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import BaseCommand from "../../structures/BaseCommand.js";

export default class PingCommand extends BaseCommand {
    constructor() {
        super(
            new SlashCommandBuilder()
                .setName("mute")
                .setDescription("mute a user")
                .addUserOption(
                    new SlashCommandUserOption()
                        .setName("target")
                        .setDescription("User you wish to punish")
                        .setRequired(true)
                )
                .addStringOption(option => 
                        option.setName("reason")
                            .setDescription("Reason for muting this user")
                            .setRequired(true)
                    )
                .addStringOption(option => 
                    option.setName("time")
                        .setDescription("Time this user should be muted for")
                        .setRequired(true)
                )
                    ,
            true,
        )
    }

    async run(interaction) {
        if(!await interaction.client.moderator._automod(interaction, "mute")) await interaction.client.moderator.mute(interaction);
    }
}