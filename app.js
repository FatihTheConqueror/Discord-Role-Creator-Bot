import {Client} from "discord.js"
import fs, { readdirSync } from "fs"
import "dotenv/config"


const client = new Client({intents:["GuildMembers","GuildMessages","GuildIntegrations","Guilds","MessageContent"]})



const event = await import(`./event/ready.js`).then(m=>m.default)
event(client)


client.on("interactionCreate", async interaction =>{
  if (interaction.commandName == "role_create") { //role_create command name
    if (!fs.existsSync(`./guilds_info/${interaction.guildId}.txt`)) { //checking if role_admin roles not exists
      return interaction.reply("Please adjust the approved or rejected role votes by **/role_admin**")
    }
    if (interaction.guild.roles.cache.map(role=>role.name.toLowerCase()).includes(interaction.options.get('rol_name').value.toLowerCase())){ //checking if rol name already in use
      return interaction.reply({ content: '**Role name is already in use**', ephemeral: true }) }

    
    const role_create_func = await import("./commands/role_create.js").then(m=> m.default)
    role_create_func(interaction) //then running role create function
      
      }
  

  if (interaction.commandName == "role_admin") {
    const role_admin_func = await import("./commands/role_admin.js").then(m=>m.default)
    role_admin_func(interaction)
    
  }
  if (interaction.commandName == "get_role") { //checking if get_role command
    const get_role_func = await import("./commands/get_role.js").then(m=>m.default)
    get_role_func(interaction)
    
  }
  if (interaction.commandName == "mention_role") { //checking if mention_role command
    let role_id = interaction.options.get('role').value
  
    let user_ids = interaction.guild.roles.cache.get(role_id).members.map(m => m.user.id)
    if (user_ids.length <= 0) {
      interaction.reply("**No user has this role !**")
    }
    else {
      let msg_content = ""
      user_ids.forEach(element =>{
        msg_content += `<@${element}> `
      })
      interaction.reply(msg_content)

    }
    
    
    
    

    
  }
})


client.login(process.env.token) //bot token