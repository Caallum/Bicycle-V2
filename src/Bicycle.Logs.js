import embed from "./utils/embed.js"
import BicycleConfig from "./Bicycle.Config.js"
import { Message } from "discord.js";

function formatDate(date) {
    let options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
        timeZone: 'UTC'
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
}

function distance(startingTimestamp) {
    let distance = new Date().getTime() - startingTimestamp;

    let days = Math.floor(distance / (1000 * 60 * 60 * 24))
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`
}

export const permissions = {
    ADMINISTRATOR: 'Administrator',
    VIEW_AUDIT_LOG: 'View Audit Log',
    MANAGE_GUILD: 'Manage Server',
    MANAGE_ROLES: 'Manage Roles',
    MANAGE_CHANNELS: 'Manage Channels',
    KICK_MEMBERS: 'Kick Members',
    BAN_MEMBERS: 'Ban Members',
    CREATE_INSTANT_INVITE: 'Create Invite',
    CHANGE_NICKNAME: 'Change Nickname',
    MANAGE_NICKNAMES: 'Manage Nicknames',
    MANAGE_EMOJIS: 'Manage Emojis',
    MANAGE_WEBHOOKS: 'Manage Webhooks',
    VIEW_CHANNEL: 'View Channels',
    SEND_MESSAGES: 'Send Messages',
    SEND_TTS_MESSAGES: 'Send Text-to-Speech Messages',
    MANAGE_MESSAGES: 'Manage Messages',
    EMBED_LINKS: 'Embed Links',
    ATTACH_FILES: 'Attach Files',
    READ_MESSAGE_HISTORY: 'Read Message History',
    MENTION_EVERYONE: 'Mention @everyone, @here, and All Roles',
    USE_EXTERNAL_EMOJIS: 'Use External Emojis',
    ADD_REACTIONS: 'Add Reactioins',
    CONNECT: 'Connect',
    SPEAK: 'Speak',
    MUTE_MEMBERS: 'Mute Members',
    DEAFEN_MEMBERS: 'Deafen Members',
    MOVE_MEMBERS: 'Move Members',
    USE_VAD: 'Video',
    PRIORITY_SPEAKER: 'Priority Speaker',
    STREAM: 'Stream',
    VIEW_GUILD_INSIGHTS: 'View Server Insights'
};

export default class BicycleLogs {
    constructor(client) {
        this.client = client
    }

    async MessageEdit(OldMessage, NewMessage) {
        if(OldMessage.partial) return;
        if(NewMessage.partial) return;

        if(OldMessage.embeds.length > 0) return;
        if(NewMessage.embeds.length > 0) return;

        this._log("Message Edit", `Message edited in **${NewMessage.channel.toString()}** sent by **${NewMessage.author.toString()}**\n\n**Before:**\n${OldMessage.content}\n\n**After:**\n${NewMessage.content}`)
    }

    async MessageDelete(message) {   
        if(!message.content) return;
        if(message.partial) await message.fetch()

        return this._log("Message Delete", `Message deleted in **${message.channel.toString()}** sent by **${message.author.toString()}**\n\n**Content:**\n${message.content}`)
    }

    async MemberAdd(member) {
        this._log("Member Joined", `${member.toString()} has just joined **${member.guild.name}**\n\n**Member Count:** ${member.guild.memberCount}\n**Account Created:** ${formatDate(member.user.createdAt)}`, member.user.displayAvatarURL({ dynamic: true }))
    }

    async MemberRemove(member) {
        this._log("Member Left", `${member.toString()} has just left **${member.guild.name}**\n\n**Member Count:** ${member.guild.memberCount}\n**Member For:** ${distance(member.joinedTimestamp)}`, member.user.displayAvatarURL({ dynamic: true }))
    }

    async MemberUpdate(oldMember, newMember) {
        let description = "";

        if(oldMember.displayName != newMember.displayName) description +=  `**Nickname:**\nBefore: *${oldMember.displayName}* | After: *${newMember.displayName}*\n`
        if(!oldMember.roles.premiumSubscriberRole && newMember.roles.premiumSubscriberRole) description += `**Starting Boosting Server**\n`
        if(oldMember.roles.premiumSubscriberRole && !newMember.roles.premiumSubscriberRole) description += `**Stopped Boosting Server**\n`

        const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id))
        const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id))
        if(addedRoles.size > 0) description += `**Roles Added:** ${addedRoles.map(r => r.name).join(", ")}\n`
        if(removedRoles.size > 0) description += `**Roled Removed:** ${removedRoles.map(r => r.name).join(", ")}\n`

        if(description.length > 0) {
            return this._log("Member Updated", `**Member:** ${newMember.toString()}\n\n${description}`)
        }
    }

    async ChannelCreate(channel) {
        if(channel.type == "DM") return;

        let guild = channel.guild;
        let { executor, target } = await this._getAudit("CHANNEL_CREATE", guild);
        if(!executor) return;

        this._log("Channel Created", `**Name:** ${channel.toString()}\n**Type:** ${channel.type}\n**Category:** ${channel.parent.name}\n**Created By:** ${executor.toString()}`)
    }

    async ChannelDelete(channel) {
        if(channel.type == "DM") return;
        
        let guild = channel.guild;
        let { executor, target } = await this._getAudit("CHANNEL_DELETE", guild);
        if(!executor) return;

        this._log("Channel Deleted", `**Name:** ${channel.name}\n**Type:** ${channel.type}\n**Category:** ${channel.parent.name}\n**Deleted By:** ${executor.toString()}`)
    }

    async RoleCreate(role) {
        let guild = role.guild;
        let { executor, target } = await this._getAudit("ROLE_CREATE", guild);
        if(!executor) return;

        this._log("Role Created", `**Name:** ${role.toString()}\n**Created By:** ${executor.toString()}`)
    }

    async RoleDelete(role) {
        let guild = role.guild;
        let { executor, target } = await this._getAudit("ROLE_DELETE", guild);
        if(!executor) return;

        this._log("Role Deleted", `**Name:** ${role.toString()}\n**Deleted By:** ${executor.toString()}`)
    }

    async RoleUpdate(oldRole, newRole) {
        let guild = newRole.guild
        let { executor, target } = await this._getAudit("ROLE_UPDATE", guild);
        if(!executor) return;

        let oldPermissions = oldRole.permissions;
        let newPermissions = newRole.permissions;

        let removedBitfield = newPermissions.missing(oldPermissions, false);
        let addedBitfield = oldPermissions.missing(newPermissions, false);

        let addedPermissions = addedBitfield.map(perm => permissions[perm]).join(", ")
        let removedPermissions = removedBitfield.map(perm => permissions[perm]).join(", ")

        let status = {
            true: '✅',
            false: '❌'
        }

        let description = "";

        if(oldRole.name != newRole.name) description += `**Name:**\nBefore: *${oldRole.name}* | After: *${newRole.name}*\n`
        if(oldRole.color != newRole.color) description += `**Color:**\nBefore: *${oldRole.hexColor}* | After: *${newRole.hexColor}*\n`
        if(oldRole.hoist != newRole.hoist) description += `**Hoisted:**\nBefore: *${status[oldRole.hoist]}* | After: *${status[newRole.hoist]}*\n`
        if(oldRole.mentionable != newRole.mentionable) description += `**Mentionable:**\nBefore: *${status[oldRole.mentionable]}* | After: *${status[newRole.mentionable]}*\n`
        if(addedPermissions.length > 0) description += `**Added Permissions:**\n${addedPermissions}\n`
        if(removedPermissions.length > 0) description += `**Removed Permissions:**\n${removedPermissions}\n`

        if(description.length > 0) {
            return this._log("Role Updated", `**Role Name**: ${newRole.name}\n\n${description}`)
        }
    }

    async _log(title, description, thumbnail = null) {
        let logChannel = await this.client.channels.cache.get(BicycleConfig.important.bot.moderation.logChannel);
        if(!logChannel) return;

        return new embed(logChannel, {
            title: title,
            description: description,
            thumbnail: thumbnail
        })
    }

    async _getAudit(type, guild) {
        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: type
        }) 

        const first = fetchedLogs.entries.first();

        if(!first) return null;
        return {
            executor: first.executor,
            target: first.target
        }
    }
} 