const {client} = import('../index.js')



const ready_event_prep = async function ready_event(client, message){
  client.logger.log("Client is ready")
  client.logger.log("Client is ready")
  client.db.set('roles', []).write()
  client.db.set('channels', []).write()
  client.db.set('members', []).write()
  client.db.set('guilds', []).write()
  client.guilds.cache.each(async g => {
    let guildObj = {
      'guild_name': await g.name,
        'guild_id' : await g.id
      
      }
      console.log(await g)
      let roles = await g.roles.cache
      let channels = await g.channels.cache
    
  })
}

let ready_event = {
  name: "ready",
  description: "Event emits when Discord client is ready",
}

export let ready = ready_event
  
  {
 
  event: function (client, message) {





      let roleArray = []
      let memberArray = []
      let channemitlArray = []
      roles.each(r => roleArray.push(r))
      channels.each(r => channelArray.push(r))
      let roleMap = roleArray.map(o => {
        let obj = {}
        //console.log(o)
        obj.name = o.name
        obj.id = o.id
        obj.memberCount = o.memberCount
        return obj
      })
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
    let flatRoles = client.db.get('roles').flattenDeep().value()
    client.db.set('roles', flatRoles).write()
    let flatChannels = client.db.get('channels').flattenDeep().value()
    client.db.set('channels', flatChannels).write()

  }

}