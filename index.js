const Discord = require("discord.js")
require('dotenv').config()
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })

var moment = require('moment')
var mysql = require('mysql');
var fs = require('fs');
const PREFIX = '!'

var today = new Date()
var year = today.getFullYear()
var month = today.getMonth() + 1
var days = today.getDate()
const date = `${days}-${month}-${year}`

var con = mysql.createConnection({
  host: "5.9.8.124",
  port: "3306",
  user: "u1554557_Kv9ZUKtCJI",
  password: "u1554557_Kv9ZUKtCJI",
  database: "s1554557_sou-rp"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("messageCreate", msg => {
  let user = msg.author
  const args = msg.content.slice(PREFIX.length).trim().split(' ');
  const command = args.shift().toLowerCase();
  const userid = user.id
  if(!user.bot)
  {
    if(command === 'gclog')
    {
      if(!msg.channel.name.includes("bot-command")) return msg.reply(`This command can only used in <#862263342496088084>`)
      if(!fs.existsSync(`${date}`))
      {
        fs.mkdirSync(`${date}`)
      }
      con.query(`SELECT * FROM verified WHERE discord='${userid}' LIMIT 1`, function(err, result) {
        if (err) throw err;
        if(result.length)
        {
          result.forEach(discordID =>
          {
            con.query(`SELECT * FROM characters WHERE A_ID='${discordID.id}'`, function(err, result) 
            {
              if (err) throw err;
              if(result.length)
              {
                result.forEach(i =>
                {
                  con.query(`SELECT * FROM playerchatlog WHERE PlayerName='${i.Name}' && Date='${date}' && Inserted='0'`, function(err, res) 
                  {
                    if (err) throw err;
                    if(!res.length)
                    {
                      if(fs.existsSync(`${date}/${i.Name}.txt`))
                      {
                        msg.channel.send(
                        {
                        files: [`${date}/${i.Name}.txt`]
                        });
                      }
                      else
                      {
                        return msg.reply(`${i.Name} didnt have any chatlog today!`)
                      }
                    }
                    if(res.length)
                    {
                      res.forEach(chatlog =>
                      {
                        con.query(`UPDATE playerchatlog SET Inserted='1' WHERE PlayerName='${chatlog.PlayerName}' && Date='${date}' && Inserted='0'`)
                        fs.appendFileSync(`${date}/${chatlog.PlayerName}.txt`, `${chatlog.ChatLog}\n`, (error) => 
                        {
                          if(error)
                          {
                            console.error;
                            return;
                          }
                        })
                      })
                      fs.appendFileSync(`${date}/${i.Name}.txt`, `\n`, (error) => 
                      {
                        if(error)
                        {
                            console.error;
                            return;
                        }
                      })
                      msg.channel.send({
                        files: [`${date}/${i.Name}.txt`]
                      })
                      con.query(`DELETE FROM playerchatlog WHERE PlayerName='${i.Name}' && Date='${date}' && Inserted='1'`)
                    }
                  })
                })
              }
              else 
              {
                msg.reply("You didnt have any character")
                return
              }
            })
          })
        }
        else
        {
          msg.reply("You didnt have any ucp");
          return;
        }
      })
    }
    if(command === 'agclog')
    {
      if(!msg.channel.name.includes("bot-settings")) return msg.reply(`This command can only used in <#862263313021927445>`)
      if(!args.length) return msg.reply("!agclog [Player Name]");
      
      if(!fs.existsSync(`${date}`))
      {
        fs.mkdirSync(`${date}`)
      }
      con.query(`SELECT * FROM playerchatlog WHERE PlayerName='${args[0]}' && Date='${date}' && Inserted='0'`, function(err, result) {
        if (err) throw err;
        if(result.length)
        {
          result.forEach(playerchatlogs => 
          {
            con.query(`UPDATE playerchatlog SET Inserted='1' WHERE PlayerName='${playerchatlogs.PlayerName}' && Date='${date}'`)
            fs.appendFileSync(`${date}/${playerchatlogs.PlayerName}.txt`, `${playerchatlogs.ChatLog}\n`, (error) => 
              {
                if(error)
                {
                    console.error;
                    return;
                }
              })
          })
          fs.appendFileSync(`${date}/${args[0]}.txt`, `\n`, (error) => 
          {
            if(error)
            {
                console.error;
                return;
            }
          })
          con.query(`DELETE FROM playerchatlog WHERE PlayerName='${args[0]}' && Date='${date}' && Inserted='1'`)
          msg.channel.send({
            files: [`${date}/${args[0]}.txt`]
          });
        }
        else
        {
          if(fs.existsSync(`${date}/${args[0]}.txt`))
          {
            msg.channel.send({
              files: [`${date}/${args[0]}.txt`]
            });
          }
          else
          {
            return msg.reply(`Tidak ditemukan chatlog dengan nama ${args[0]} pada hari ini`)
          }
        }
      })
    }
  }
})

console.log(process.env.TOKEN)
client.login(process.env.TOKEN)