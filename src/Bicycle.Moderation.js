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

        this._automod(interaction, "warn")

        if(interaction.automod) {
            moderator = {
                user: {
                    tag: "AUTOMOD#0001",
                    id: "AUTOMOD"
                },
                id: "AUTOMOD"
            }
        }

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
        let time
        let moderator = interaction.member

        if(interaction.automod) {
            moderator = {
                user: {
                    tag: "AUTOMOD#0001",
                    id: "AUTOMOD"
                },
                id: "AUTOMOD"
            }

            time = "30m"
            reason = `REACHED MAX WARNS`
        } else time = interaction.options.getString("time")

        let timeRegex = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w)?$/i;

        if(!timeRegex.exec(time)) return new embed(interaction, { title: "Invalid Time Inputted!", description: "Correct format: `{number}{time period (s/m/h/d)}"})
        
        let member = await interaction.guild.members.fetch(user.id).catch((e) => { 
            new Logger({ error: true, message: `An error has occured: ${e}`})
            new embed(interaction, { title: `Something went wrong`, description: `An error has occured! Please get the developer to look into this` })
        })
        if(!member) return new embed(interaction, { title: "Something went wrong", description: "I cannot find that member, please try again!" });

        member.timeout(ms(time), reason);
        let amount = await this._addAmount(member.id, "mute");
        let caseNumber = await this.client.case.addCase(moderator.user, user, reason, "mute", time)
        this._log("mute", moderator, user, caseNumber, reason)

        new embed(user, {
            title: `Moderation`,
            description: `You have been muted in __${interaction.guild.name}__! You now have \`${amount} ${amount == 1 ? "mute" : "mutes"}!\`\n\n**Case ID:** ${caseNumber}\n**Reason:** ${reason}\n**Time:** ${time}\n**Moderator:** ${moderator.user.tag} (${moderator.id})`
        });
        new embed(interaction, {
            title: `Moderation`,
            description: `Successfully muted **${user.toString()}** for **${reason}** and for **${time}**! They now have \`${amount} ${amount == 1 ? "mute" : "mutes"}!\``
        });
    }

    async unmute(interaction) {
        let user = interaction.options.getUser("target")
        let reason = interaction.options.getString("reason")
        let moderator = interaction.member

        let member = await interaction.guild.members.fetch(user.id).catch((e) => { 
            new Logger({ error: true, message: `An error has occured: ${e}`})
            new embed(interaction, { title: `Something went wrong`, description: `An error has occured! Please get the developer to look into this` })
        })
        if(!member) return new embed(interaction, { title: "Something went wrong", description: "I cannot find that member, please try again!" });

        member.timeout(null, reason)
        let amount = await this._removeAmount(user.id, "mute")
        let caseNumber = await this.client.case.addCase(moderator.user, user, reason, "unmute")
        this._log("unmute", moderator, user, caseNumber, reason)

        new embed(user, {
            title: `Moderation`,
            description: `You have been unmute in __${interaction.guild.name}__! You now have \`${amount} ${amount == 1 ? "mute" : "mutes"}!\`\n\n**Case ID:** ${caseNumber}\n**Reason:** ${reason}\n**Moderator:** ${moderator.user.tag} (${moderator.id})`
        });
        new embed(interaction, {
            title: `Moderation`,
            description: `Successfully unmuted **${user.toString()}** for **${reason}**! They now have \`${amount} ${amount == 1 ? "mute" : "mutes"}!\``
        });
    }

    async kick(interaction) {
        let user = interaction.options.getUser("target")
        let reason = interaction.options.getString("reason")
        let moderator = interaction.member

        if(interaction.automod) {
            moderator = {
                user: {
                    tag: "AUTOMOD#0001",
                    id: "AUTOMOD"
                },
                id: "AUTOMOD"
            }

            reason = `REACHED MAX MUTES`
        }

        let member = await interaction.guild.members.fetch(user.id).catch((e) => { 
            new Logger({ error: true, message: `An error has occured: ${e}`})
            new embed(interaction, { title: `Something went wrong`, description: `An error has occured! Please get the developer to look into this` })
        })
        if(!member) return new embed(interaction, { title: "Something went wrong", description: "I cannot find that member, please try again!" });
        let amount = await this._addAmount(user.id, "kick")
        let caseNumber = await this.client.case.addCase(moderator.user, user, reason, "kick")
        this._log("kick", moderator, user, caseNumber, reason)

        await new embed(user, {
            title: `Moderation`,
            description: `You have been kicked from __${interaction.guild.name}__! You now have \`${amount} ${amount == 1 ? "kick" : "kicks"}!\`\n\n**Case ID:** ${caseNumber}\n**Reason:** ${reason}\n**Moderator:** ${moderator.user.tag} (${moderator.id})`
        });
        await new embed(interaction, {
            title: `Moderation`,
            description: `Successfully kicked **${user.toString()}** for **${reason}**! They now have \`${amount} ${amount == 1 ? "kick" : "kicks"}!\``
        });

        member.kick(reason);
    }

    async ban(interaction) {
        let user = interaction.options.getUser("target")
        let reason = interaction.options.getString("reason")
        let moderator = interaction.user;

        if(interaction.automod) {
            moderator = {
                user: {
                    tag: "AUTOMOD#0001",
                    id: "AUTOMOD"
                },
                id: "AUTOMOD"
            }

            reason = `REACHED MAX KICKS`
        }

        let member = await interaction.guild.members.fetch(user.id).catch((e) => { 
            new Logger({ error: true, message: `An error has occured: ${e}`})
            new embed(interaction, { title: `Something went wrong`, description: `An error has occured! Please get the developer to look into this` })
        })
        if(!member) return new embed(interaction, { title: "Something went wrong", description: "I cannot find that member, please try again!" });

        let amount = await this._addAmount(user.id, "ban")
        let caseNumber = await this.client.case.addCase(moderator.user, user, reason, "ban")
        this._log("ban", moderator, user, caseNumber, reason)

        await new embed(user, {
            title: `Moderation`,
            description: `You have been banned from __${interaction.guild.name}__! You now have \`${amount} ${amount == 1 ? "ban" : "bans"}!\`\n\n**Case ID:** ${caseNumber}\n**Reason:** ${reason}\n**Moderator:** ${moderator.user.tag} (${moderator.id})`
        });
        await new embed(interaction, {
            title: `Moderation`,
            description: `Successfully banned **${user.toString()}** for **${reason}**! They now have \`${amount} ${amount == 1 ? "ban" : "bans"}!\``
        });

        member.ban({ deleteMessageDays: 7, reason: reason });
    }

    async unban(interaction) {
        let memberId = interaction.options.getString("target")
        let reason = interaction.options.getString("reason")
        let moderator = interaction.member
        let guild = interaction.guild

        if(!guild.bans.fetch(memberId)) return new embed(interaction, { title: `Something went wrong`, description: `That member is not banned!?!?` })

        let user = await guild.members.unban(memberId).catch((e) => { 
            new Logger({ error: true, message: `An error has occured: ${e}`})
            new embed(interaction, { title: `Something went wrong`, description: `An error has occured! Please get the developer to look into this` })
        })

        let amount = await this._removeAmount(user.id, "ban")
        let caseNumber = await this.client.case.addCase(moderator.user, user, reason, "unban")
        this._log("unban", moderator, user, caseNumber, reason)

        new embed(interaction, {
            title: `Moderation`,
            description: `Successfully unbanned **${user.toString()}** for **${reason}**! They now have \`${amount} ${amount == 1 ? "bans" : "bans"}!\``
        });
    }

    async case(interaction) {
        let caseId = interaction.options.getNumber("caseid")

        let caseObject = await this.client.case.findCase(caseId)

        if(!caseObject) return new embed(interaction, { title: `Case ${caseId} not Found!` })

        if(caseObject.delete) {
            new embed(interaction, {
                title: `Case ${caseId} Found!`,
                description: `**User:** ${caseObject.user.userTag} (${caseObject.user.userId})\n**Moderator:** ${caseObject.moderator.userTag} (${caseObject.moderator.userId})\n\n**This case has been deleted, so information such as punishment, reason, and date have been removed**`
            })
        } else {
            new embed(interaction, {
                title: `Case ${caseId} Found!`,
                description: `**User:** ${caseObject.user.userTag} (${caseObject.user.userId})\n**Moderator:** ${caseObject.moderator.userTag} (${caseObject.moderator.userId})\n\n**Reason:** ${caseObject.action.reason}\n**Punishment:** ${caseObject.action.punishment}${caseObject.action.time ? `\n**Time:** ${caseObject.action.time}` : ""}\n**Date:** ${caseObject.action.date}`
            })
        }
    }

    async deleteCase(interaction) {
        let caseId = interaction.options.getNumber("caseid")
        let caseObject = await this.client.case.findCase(caseId)

        if(!caseObject) return new embed(interaction, { title: `Case ${caseId} not Found!` })
        if(caseObject.delete) return new embed(interaction, { title: `Case ${caseId} is Deleted! `})

        new embed(interaction, {
            title: `Case ${caseId} Deleted!`
        });
        await this.client.case.deleteCase(caseId)
        this._log("case delete", interaction.member, { tag: `AUTOMOD#0000`, id: "AUTOMOD" }, caseId)
    }
    
    async editCase(interaction) {
        let caseId = interaction.options.getNumber("caseid")
        let caseObject = await this.client.case.findCase(caseId)
        if(!caseObject) return new embed(interaction, { title: `Case ${caseId} not Found!` })
        if(caseObject.delete) return new embed(interaction, { title: `Case ${caseId} is Deleted! `})

        let reason = interaction.options.getString("reason")

        new embed(interaction, {
            title: `Case ${caseId} Editted!`
        });
        await this.client.case.editCase(caseId, reason)
        this._log("case edit", interaction.member, { tag: `AUTOMOD#0000`, id: "AUTOMOD" }, caseId)
    }

    async _automod(interaction, type) {
        let user = interaction.options.getUser("target")

        let amount = await this._getAmount(user.id, type);
        if(amount >= 3) {
            interaction.automod = true

            if(type == "warn") {
                this.mute(interaction)
                return true
            }

            if(type == "mute") {
                this.kick(interaction)
                return true
            }

            if(type == "kick") {
                this.ban(interaction)
                return true
            }
        }
    }

    async history(interaction) {
        let user = interaction.options.getUser("target")
        let history = await this.client.case.getUserCases(user.id);
        if(!history) return new embed(interaction, { title: `${user.tag} has not previous punishment history!` })

        let cases = [];
        history.forEach(punishment => {
            cases.push(punishment.case);
        });

        return new embed(interaction, { title: `${user.tag} has ${cases.length} previous punishmens`, description: cases.map((id) => `Case ${id}`).join(", ")})
    }

    async _log(command, moderator, user, caseId, reason = null) {
        let channel = await this.client.channels.fetch(BiycleConfig.important.bot.moderation.logChannel).catch(() => { });
        if(!channel) return;

        if(reason) {
            new embed(channel, {
                title: "Command Fired",
                description: `**Command:** ${command}\n**Moderator:** ${moderator.user.tag} (${moderator.user.id}) \n**User:** ${user.tag} (${user.id})\n**Reason:** ${reason}\n**Case ID:** ${caseId}`
            })
        } else {
            new embed(channel, {
                title: "Command Fired",
                description: `**Command:** ${command}\n**Moderator:** ${moderator.user.tag} (${moderator.user.id}) \n**User:** ${user.tag} (${user.id})\n**Case ID:** ${caseId}`
            })
        }
    }
}