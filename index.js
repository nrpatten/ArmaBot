const Discord = require('discord.js');
const client = new Discord.Client();
const Gamedig = require('gamedig');
const clientID = '***YourID***';
const prefix = '!';
const game = 'arma3',
      host = '***YorServerIP***',
      port = '***YourServerPort***';

client.on('ready', () => {
  console.log(`ArmaBot has started, with ${client.users.size} users, and ${client.channels.size} channels.`)
});

function timeFormat(time) {   
  var hrs = ~~(time / 3600);
  var mins = ~~((time % 3600) / 60);
  var secs = Math.round(time % 60);
  var ret = "";
  if (hrs > 1) {
    ret += "" + hrs + " Hrs " + (mins < 10 ? "0" : "");
  } else
  if (hrs > 0) {
    ret += "" + hrs + " Hr " + (mins < 10 ? "0" : "");
  }
  ret += "" + mins + " Mins " + (secs < 10 ? "0" : "");
  ret += "" + secs + " Secs";
  return ret;
};

client.on('message', message => {
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'help') {
    message.channel.send('```' + 'Commands are: \n!info for server info \n!Players for a list of online players \n!stats for info/players \n!search for other server stats expample: !search 45.121.211.65 2302' + '```');
  }

  if (command === 'info') {
    Gamedig.query({
      type: game,
      host: host,
      port: port
    },
    function(err, data) {
      if (err) {
        message.channel.send('```' + 'Server is offline or restarting' + '```');
      } else {
        message.channel.send('```' + 'Server Name: ' + data.name + '\n' + 'Map: ' + data.map + '\n' + 'players online: ' + data.raw.numplayers + '/' + data.maxplayers + '\n' + 'Server Ip/Port: ' + data.query.host + ':' + data.query.port + '```');
      }
    });
  }

  if (command === 'players') {
    Gamedig.query({
      type: game,
      host: host,
      port: port
    },
    function(err, data) {
      if (err) {
        message.channel.send('```' + 'Server is offline or restarting' + '```');
      } else {
        var player = data.players;
        if (player == 0) {
          message.channel.send('There is currently no players on the server :frowning:'); 
        } else
          message.channel.send('```' + 'Number of players online: ' + data.raw.numplayers + '/' + data.maxplayers + '```');
        for (var i in player) {
          message.channel.send('```' + player[i].name + ' - Score: ' + player[i].score + ' - Time In Game: ' + timeFormat(player[i].time) + '```');
        }
      }
    });
  }

  if (command === 'stats') {
    Gamedig.query({
      type: game,
      host: host,
      port: port
    },
    function(err, data) {
      if (err) {
        message.channel.send('```' + 'Server is offline or restarting' + '```');
      } else {
        message.channel.send('```' + 'Server Name: ' + data.name + '\n' + 'Map: ' + data.map + '\n' + 'players online: ' + data.raw.numplayers + '/' + data.maxplayers + '\n' + 'Server Ip/Port: ' + data.query.host + ':' + data.query.port + '```');
        var player = data.players;
        for (var i in player) {
          message.channel.send('```' + player[i].name + ' - Score: ' + player[i].score + ' - Time In Game: ' + timeFormat(player[i].time) + '```');
        }
      }
    });
  }
  
  if (command === "search") {
    var ip = args.slice(0, 1).join(' ').toUpperCase();
    var p = args.slice(1, 2).join(' ').toUpperCase();
    if ( !ip && !p || ip && p < 2 ) {
      message.channel.send('Error! make sure the servers ip and port are correct  \nPlease use example ' + '`!search 45.121.211.65 2302`');
    } else
    if ( !p.match(/^\d+$/) ) {
      message.channel.send('Error port is numeric only');
    } else
    Gamedig.query({
      type: game,
      host: ip,
      port: p
    },
    function(err, data) {
      if (err) {
        message.channel.send('```' + 'Server is offline or restarting' + '```');
      } else {
        message.channel.send('```' + 'Server Name: ' + data.name + '\n' + 'Map: ' + data.map + '\n' + 'players online: ' + data.raw.numplayers + '/' + data.maxplayers + '\n' + 'Server Ip/Port: ' + data.query.host + ':' + data.query.port + '```');
      }
    });
  }
});

client.login(clientID);
