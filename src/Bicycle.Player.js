import { DisTube } from 'distube';
import { YtDlpPlugin } from '@distube/yt-dlp';
import { SpotifyPlugin } from '@distube/spotify';
import { SoundCloudPlugin } from '@distube/soundcloud';
import { MessageEmbed } from 'discord.js';
import config from './Bicycle.Config.js';
import embed from "./utils/embed.js"
import Logger from './Logger.js';

export default class musicPlayer {
    constructor(client) {
        this.client = client;
        this.player = new DisTube(this.client, {
            youtubeDL: false,
            youtubeCookie: config.important.music.youtubeCookie,
            plugins: [
                new YtDlpPlugin({
                    updateYouTubeDL: true
                }),
                new SpotifyPlugin({
                    emitEventsAfterFetching: true,
                    api: {
                        clientId: config.important.music.spotify.id,
                        clientSecret: config.important.music.spotify.secret
                    }
                }),
                new SoundCloudPlugin()
            ],
            leaveOnFinish: true,
            leaveOnEmpty: true
        });
        this.events();
    }

    async embed(title, description, interaction, ephemeral = false) {
        new embed(interaction, {
            title: title,
            description: description,
            ephemeral: ephemeral
        })
    }

    async play(interaction) {
        let query = interaction.options.getString("query");
        if(!query) return this.embed(`Something went wrong...`, "", interaction, true);
        let voiceChannel = interaction.member?.voice?.channel;
        if(!voiceChannel) return this.embed(`First join a voice channel to use this command!`, "", interaction, true);
        if(interaction.guild?.me?.voice?.channel && voiceChannel.id != interaction.guild?.me?.voice?.channel?.id) return this.embed(`I am already in a voice channel! Join the one I am already in to use this command`, "", interaction, true)

        this.player.play(voiceChannel, query, {
            member: interaction.member,
            textChannel: interaction.channel
        });

        await interaction.deferReply();
        await interaction.deleteReply();
    }

    async stop(interaction) {
        if(interaction.member.roles.cache.has("936345890543788082")) return this.embed(`You do not have permission to do that!`, "", interaction, true);

        let voiceChannel = interaction.member?.voice?.channel;
        if(!voiceChannel) return this.embed(`First join a voice channel to use this command!`, "", interaction, true);
        if(voiceChannel.id != interaction.guild?.me?.voice?.channel?.id) return this.embed(`I am already in a voice channel! Join the one I am already in to use this command`,"", interaction, true);

        if(!await this.player.getQueue(interaction.guild.id)) return this.embed(`Music Player is currently not playing anything`, "", interaction, true);

        this.player.pause(interaction.guild.id)
        this.embed(`Music Player has been stopped`, "", interaction);
    }

    async resume(interaction) {
        if(interaction.member.roles.cache.has("936345890543788082")) return this.embed(`You do not have permission to do that!`, "", interaction, true);

        let voiceChannel = interaction.member?.voice?.channel;
        if(!voiceChannel) return this.embed(`First join a voice channel to use this command!`, "", interaction, true);
        if(voiceChannel.id != interaction.guild?.me?.voice?.channel?.id) return this.embed(`I am already in a voice channel! Join the one I am already in to use this command`,"", interaction, true);

        if(!await this.player.getQueue(interaction.guild.id)) return this.embed(`Music Player is currently not playing anything`, "", interaction, true);

        this.player.resume(interaction.guild.id);
        this.embed(`Music Player has been resumed`, "", interaction)
    }
    
    async skip(interaction) {
        if(interaction.member.roles.cache.has("936345890543788082")) return this.embed(`You do not have permission to do that!`, "", interaction, true);

        let voiceChannel = interaction.member?.voice?.channel;
        if(!voiceChannel) return this.embed(`First join a voice channel to use this command!`, "", interaction, true);
        if(voiceChannel.id != interaction.guild?.me?.voice?.channel?.id) return this.embed(`I am already in a voice channel! Join the one I am already in to use this command`,"", interaction, true);

        if(!await this.player.getQueue(interaction.guild.id)) return this.embed(`Music Player is currently not playing anything`, "", interaction, true);

        this.player.skip(interaction.guild.id);

        this.embed(`Working...`, "", interaction)
        await interaction.deleteReply();
    }

    async leave(interaction) {
        if(interaction.member.roles.cache.has("936345890543788082")) return this.embed(`You do not have permission to do that!`, "", interaction, true);

        let voiceChannel = interaction.member?.voice?.channel;
        if(!voiceChannel) return this.embed(`First join a voice channel to use this command!`, "", interaction, true);
        if(voiceChannel.id != interaction.guild?.me?.voice?.channel?.id) return this.embed(`I am already in a voice channel! Join the one I am already in to use this command`,"", interaction, true);

        if(!await this.player.getQueue(interaction.guild.id)) return this.embed(`Music Player is currently not playing anything`, "", interaction, true);

        this.player.stop(interaction.guild.id);
        this.embed(`Music Player has been destroyed and bot has left voice channel`, "", interaction)
    }

    async volume(interaction) {
        let volume = interaction.options.getNumber("percentage");
        if(!volume) return this.embed(`Something went wrong, try again later`, "", interaction, true);

        if(interaction.member.roles.cache.has("936345890543788082")) return this.embed(`You do not have permission to do that!`, "", interaction, true);

        let voiceChannel = interaction.member?.voice?.channel;
        if(!voiceChannel) return this.embed(`First join a voice channel to use this command!`, "", interaction, true);
        if(voiceChannel.id != interaction.guild?.me?.voice?.channel?.id) return this.embed(`I am already in a voice channel! Join the one I am already in to use this command`,"", interaction, true);

        if(!await this.player.getQueue(interaction.guild.id)) return this.embed(`Music Player is currently not playing anything`, "", interaction, true);

        this.player.setVolume(interaction.guild.id, Number(volume));
        new embed(interaction, {
            title: `Set volume to \`${volume}%\``
        })
    }

    async current(interaction) {
        if(!await this.player.getQueue(interaction.guild.id)) return this.embed(`Music Player is currently not playing anything`, "", interaction, true);

        let queue = await this.player.getQueue(interaction.guild.id);
        let song = queue.songs[0];

        new embed(interaction, {
            thumbnail: song.thumbnail,
            ephemeral: true,
            fields: (
                { name: "Song Title:", value: song.name, inline: true },
                { name: "Song Link:", value: song.url, inline: true },
                { name: "Channel:", value: song.uploader, inline: true },
                { name: "Duration:", value: song.formattedDuration, inline: true },
                { name: "Requested By:", value: song.user.tag, inline: true }
            )
        })
    }

    async events() {
        this.player
            .on("error", (channel, error) => {
                new Logger({
                    error: true,
                    message: `An error has occured: ${error}`
                })
                new embed(channel, {
                    title: "Something went wrong",
                    description: "Please report this message to the developer!"
                })
            })
            .on("addSong", (queue, song) => {
                new embed(queue.textChannel, {
                    title: song.name,
                    url: song.url,
                    thumbnail: song.thumbnail,
                    description: `Added **${song.name}** by **${song.uploader.name}** to the music queue`,
                    fields: ({
                        name: `**Requested By**:`,
                        value: `${song.user.toString()}`,
                        inline: true
                    },
                    {
                        name: `**Position in Queue:**`,
                        value: `${queue.songs.length ?? "0"}`,
                        inline: true
                    }
                    ),
                })
            })
            .on("playSong", (queue, song) => {       
                    new embed(queue.textChannel, {
                        title: song.name,
                        url: song.url,
                        thumbnail: song.thumbnail,
                        description: `Now playing **${song.name}** by **${song.uploader.name}**`,
                        fields: ({
                            name: `**Requested By**:`,
                            value: `${song.user.toString()}`,
                            inline: true
                        },
                        {
                            name: `**Queue Length**`,
                            value: `${queue.songs.length ?? "0"}`,
                            inline: true
                        }
                        ),

                    })
            })
            .on("addList", (queue, playlist) => {
                new embed(queue.textChannel, {
                    title: `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to the queue!`
                })
            })
            .on("empty", (queue) => new embed(queue.textChannel, { title: `The queue is empty` }))
            .on("finish", (queue) => new embed(queue.textChannel, { title: `There are no more songs in the queue!` }))
            .on("initQueue", (queue) => {
                queue.autoplay = false;
                queue.volume = 100;
            })
    }

    async queue(interaction) {
        let queue = await this.player.getQueue(interaction.guild.id);
        if(!await this.player.getQueue(interaction.guild.id)) return this.embed(`Music Player is currently not playing anything`, "", interaction, true);

        new embed(interaction, {
            title: `Current Queue`,
            description: queue.songs.map((song, id) => `**${id+1}. ${song.name}** requested by ${song.user.toString()}`).join("\n")
        })
    }
}