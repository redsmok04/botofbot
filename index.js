const Discord = require("discord.js");
const TOKEN = "NDEyMjgzNTcxNTU4OTQwNjcy.DWIAkg.A_cbTi9sgEFkTyKEbJezbmTzPHs"
const prefix = "!";
const YTDL = require("ytdl-core");

function play(connection, message) {
    var server = servers[message.guild.id];

    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter:"audioonly"}));

    server.queue.shift();

    server.dispatcher.on("end", function(){
        if (server.queue[0]) play(connection, message);
        else connection.disconnect();
    });
}
var fortunes = [
    "yes" ,
    "no" ,
    "maybe",
    "I'm praying for you :)"
];

var bot = new Discord.Client();

var servers = {};

bot.on("ready", function(){
    console.log("ready");
});

bot.on("guildMemberAdd", function(member) {
    member.guild.channels.find("name","general").sendMessage(member.toString() +"Welcome");

});

bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;

   if (!message.content.startsWith(prefix)) return;

    var args = message.content.substring(prefix.length).split(" ");

    switch (args[0].toLowerCase()) {
        case "ping":
            message.channel.sendMessage("Pong!");
            break;
        
        case "info":
            message.channel.sendMessage("I'm Autopilot of this server, made by: Gokalp Turgut");
            break;

        case "?":
            message.channel.sendMessage("I'm a bussines cat working for my senpai.I dont get money but i eat expensive foods :3, hope you like me.");
            break;

        case "fortune":
            if (args[1]) message.channel.sendMessage(fortunes[Math.floor(Math.random() * fortunes.length)]);

             else message.channel.sendMessage("Can't read that");
                break;

        case "help":
            var embed = new Discord.RichEmbed()
                .addField("HELP MENU","A littel table to help you.", true)
                .addField("MUSIC","type !play (name of music or url).", true)
                .addField("INFO","type !info or !? to understand who am I.", true)
                .setColor("#f04d46")
                message.channel.sendEmbed(embed);
                break;
        case "play":
            if (!args[1]) {
                    message.channel.sendMessage("Please provid a link");
                    return;
            }

            if (!message.member.voiceChannel) {
                message.channel.sendMessage("You must be in a voice channel!");
                return;
            }
            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }
            var server = servers[message.guild.id];


            server.queue.push(args[1]);

            if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
                play(connection, message);
            });
            break;
            
            case "skip":
                var server = servers[message.guild.id];

                if (server.dispatcher) server.dispatcher.end();
                break;
            case "stop":
                var server = servers[message.guild.id];

                if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
            break;
            default:
            message.channel.sendMessage("Invalid command, type !help to get command list!");
    }
});

bot.login(TOKEN);