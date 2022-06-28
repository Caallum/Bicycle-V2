import Logger from "./Logger.js";
import date from "./utils/date.js"
import embed from "./utils/embed.js"
import BiycleConfig from "./Biycle.Config.js";

import ms from "ms";

export default class BicycleModeration {
    constructor(client) {
        this.client = client;
    }

    async _addAmount(userId, type) {
        let amount = await this.client.db.get(`amount.${type}-${userId}`);
        if(!amount) {
            amount = 1;
            await this.client.db.set(`amount.${type}-${userId}`, amount);
        } else {
            amount++;
            await this.client.db.set(`amount.${type}-${userId}`, amount)
        }

        return amount;
    }

    async _removeAmount(userId, type) {
        let amount = await this.client.db.get(`amount.${type}-${userId}`);
        if(!amount) {
            amount = 0;
            await this.client.db.set(`amount.${type}-${userId}`, amount);
        } else {
            amount--;
            await this.client.db.set(`amount.${type}-${userId}`, amount)
        }

        return amount;
    }

    async _getAmount(userId, type) {
        let amount = await this.client.db.get(`amount.${type}-${userId}`);
        if(!amount) return 0;

        return amount;
    }

    async warn(interaction) {
        let user = interaction.options.getUser("target");
        let reason = interaction.options.getString("reason");
        let moderator = interaction.member;

        let amount = await this._addAmount(user.id, "warn")

        let caseNumber = await this.client.case.addCase(moderator.user, user, reason, "warn");
        this._log("warn", moderator, user, caseNumber, reason);

        new embed(user, {
            title: `Moderation`,
            description: `You have been moderated in __${interaction.guild.name}__! You now have \`${amount} ${amount == 1 ? "warning" : "warnings"}!\`\n\n**Case ID:** ${caseNumber}\n**Reason:** ${reason}\n**Moderator:** ${moderator.user.tag} (${moderator.id})`
        });
        new embed(interaction, {
            title: `Moderation`,
            description: `Successfully warned **${user.toString()}** for **${reason}**! They now have \`${amount} ${amount == 1 ? "warning" : "warnings"}!\``
        });
    }

    async mute(interaction) {
        let user = interaction.options.getUser("target")
        let reason = interaction.options.getString("reason")
        let time = interaction.options.getString("time")
        let moderator = interaction.member

        let timeRegex = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w)?$/i;

        if(!timeRegex.exec(time)) return new embed(interaction, { title: "Invalid Time Inputted!", description: "Correct format: `{number}{time period (s/m/h/d)}"})
        
        let member = await interaction.guild.members.fetch(user.id).catch((e) => new Logger({ error: true, message: `An error has occured: ${e}`}))
        if(!member) return new embed(interaction, { title: "Something went wrong", description: "I cannot find that member, please try again!" });

        member.timeout(ms(time), reason);
        let amount = await this._addAmount(member.id, "mute");
        let caseNumber = await this.client.case.addCase(moderator.user, user, reason, "mute")
        this._log("mute", moderator, user, caseNumber, reason)

        new embed(user, {
            title: `Moderation`,
            description: `You have been muted in __${interaction.guild.name}__! You now have \`${amount} ${amount == 1 ? "mute" : "mutes"}!\`\n\n**Case ID:** ${caseNumber}**\n**Reason:** ${reason}\n**Time:** ${time}\n**Moderator:** ${moderator.user.tag} (${moderator.id})`
        });
        new embed(interaction, {
            title: `Moderation`,
            description: `Successfully muted **${user.toString()}** for **${reason}** and for ${time}**! They now have \`${amount} ${amount == 1 ? "mute" : "mutes"}!\``
        });
    }

    async unmute(interaction) {
        let user = interaction.options.getUser("target")
        let reason = interaction.options.getString("reasons")
        let moderator = interaction.member

        let member = await interaction.guild.members.fetch(user.id).catch((e) => new Logger({ error: true, message: `An error has occured: ${e}`} ))
        if(!member) return new embed(interaction, { title: "Something went wrong", description: "I cannot find that member, please try again!" });

        member.timeout(null, reason)
        let amount = await this._removeAmount(user.id, "unmute")
        let caseNumber = await this.client.case.addCase(moderator.user, user, reason, "unmute")
        this._log("unmute", moderator, user, caseNumber, reason)

        new embed(user, {
            title: `Moderation`,
            description: `You have been unmute in __${interaction.guild.name}__! You now have \`${amount} ${amount == 1 ? "mute" : "mutes"}!\`\n\n**Case ID:** ${caseNumber}**\n**Reason:** ${reason}\n**Moderator:** ${moderator.user.tag} (${moderator.id})`
        });
        new embed(interaction, {
            title: `Moderation`,
            description: `Successfully unmuted **${user.toString()}** for **${reason}**! They now have \`${amount} ${amount == 1 ? "mute" : "mutes"}!\``
        });
    }

    async _log(command, moderator, user, caseId, reason = null) {
        let channel = await this.client.channels.fetch(BiycleConfig.important.bot.moderation.logChannel).catch(() => { });
        if(!channel) return;

        if(reason) {
            new embed(channel, {
                title: "Command Fired",
                description: `**Command:** ${command}\n**Moderator:** ${moderator.toString()} \n**User:** ${user.toString()}\n**Reason:** ${reason}\n**Case ID:** ${caseId}`
            })
        } else {
            new embed(channel, {
                title: "Command Fired",
                description: `**Command:** ${command}\n**Moderator:** ${moderator.toString()} \n**User:** ${user.toString()}\n**Case ID:** ${caseId}`
            })
        }
    }
}