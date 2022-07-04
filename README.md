# Bicycle

> I'm a moderation bot, I'm a ticket bot, I'm a music player

## A background into Bicycle

I originally created this bot as a moderation bot for a support server I was making, and I had complete it. However I was using the djs v13 dev so it was never really complete because of the library I was using. So I decided to delete the entire code and recode it, but I lost interest, I had just spent days coding a moderation bot for me to just delete it. So I gave up on Bicycle, until I decided to finally complete it.

Originally Bicycle has a modmail system, and I had previously created a modmail system I could easily modify Bicycle to use, expect I didn't like it, I felt it was old fashioned, so I decided not to use it. And went on to create about 4 versions of a modmail system, all would work if I actually kept on working on it, but I got bored and lost interest in modmail. So I opted for a ticket system, which I am extremely pleased with.

Anyway, if you have read this then thanks, else then move onto the next "chapter" to actually setup the bot.

## Instructions on self hosting

To begin, first create a config file called `Bicycle.Config.js`, this file has to be exactly typed like that, else the bot will not work. Then go into `Bicycle.Config.Template.js` then copy the contents into your newly created config file. Once done, just start filling in the blanks. Here is a little template for the types of each slot:

```
important: {
    bot: {
        token: Discord Bot Token,
        mongoURI: Mongo DB URI,
        moderation: {
            logChannel: Discord Channel ID
        }
    },
    music: {
        spotify: {
            id: Spotify Developer ID,
            secret: Spotify Developer Secret
        },
        youtubeCookie: Valid Youtube Cookie
    }
},

other: {
    client: Discord Bot User ID,
    guild: Discord Server ID,
    tickets: {
        createCategory: Discord Category ID,  |
        pendingCategory: Discord Category ID, ----> These ID's can be the same, or different, it doesn't entirely matter.
        claimedCategory: Discord Category ID, |
        transcriptChannel: Discord Channel ID,
        options: [
            {
                name: Name of ticket option,
                description: Description of ticket option,
                emoji: Emoji for ticket option,
            }
        ]
    },

    embed: {
        color: Valid Discord Embed Color,
        footer: {
            text: Discord Embed footer text,
            icon: Discord Embed footer icon (put {avatar} if you wish for it to be the bot's avatar)
        },
        author: {
            text: Discord Embed author text,
            icon: Discord Embed author icon (put {avatar} if you wish for it to be the bot's avatar),
            url: Discord Embed author URl
        }
    }
}
```

Only optional items in the config, are the embed options, however if you wish to opt out of them, you must leave them blank.

### Once completed, simply type `npm i` in the console and wait for that to complete. Once this has been complete, then simply type `npm start` in the console and the bot should magically start!

## Reporting Errors

Simply go into the `issues` tab and then click `New Issue`, from there you can report the issue. Please include screenshots of the console or `development.logs` if it's a bot issue, and as much detail as possible and I'll try respond ASAP.

Thank you for using Bicycle



> Created by big john#5007