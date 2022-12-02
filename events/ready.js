const client = import ('../index.js')





const ready_event_prep = async function ready_event(client, message){
  console.log("Client is ready")

  await client.logger.log("Client is ready")
  await client.db.set('roles', []).write()
  await client.db.set('channels', []).write()
  await client.db.set('members', []).write()
  await client.db.set('guilds', []).write()
  await client.guilds.cache.each(async g => {
    let guildObj = {
      'guild_name': await g.name,
      'guild_id' : await g.id
      
    }
    console.log(await g)
    let roles = await g.roles.cache
    let channels = await g.channels.cache
    let roleArray = []
    let memberArray = []
    let channelArray = []
    roles.each(r => roleArray.push(r))
    channels.each(r => channelArray.push(r))
    let channelMap = channelArray.map(o => {
      let obj = {}
      //console.log(o)
      obj.name = o.name
      obj.id = o.id
      obj.type = o.type
      obj.memberCouny = o.memberCount
      return obj

    })
    
  })
}

let ready_event = {
  name: "ready",
  description: "Event emits when Discord client is ready",
  event: ready_event_prep
}

export default client
  
//   {
 











//     })
//     let flatRoles = client.db.get('roles').flattenDeep().value()
//     client.db.set('roles', flatRoles).write()
//     let flatChannels = client.db.get('channels').flattenDeep().value()
//     client.db.set('channels', flatChannels).write()

//   }

// }