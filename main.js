const express = require('express')
const app = express()
const port = 3000 // "Radiofrekvens"
const cors = require('cors')
const bodyParser = require('body-parser')
const { sequelize, Players } = require('./models')
const migrationhelper = require('./migrationhelper')

app.use(cors())
app.use(bodyParser.json())




app.get('/api/players', async (req, res) => {
    let players = await Players.findAll()
    let result = players.map(p => ({
        id: p.id,
        name: p.name,
        jersey: p.jersey,
        position: p.position
    }))
    res.json(result)
});


app.get('/api/players/:playerId', async (req, res) => {
    console.log(req.params.playerId)

    try {
        const thePlayer = await Players.findOne({
            where: { id: req.params.playerId }
        })
        console.log(thePlayer)
        let result = {
            name: thePlayer.name,
            jersey: thePlayer.jersey,
            position: thePlayer.position,
            playerId: thePlayer.playerId
        }
        return res.json(result)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
});


app.post('/api/players', async (req, res) => {

    const { name, jersey, position, } = req.body
    try {
        const player = await Players.create({ name, jersey, position })

        return res.json(player)
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }

    res.status(201).send('Created')
});



// app.delete('/api/players/:anvId', (req, res) => {
//     console.log(req.params.anvId)
//     let p = players.find(player => player.id == req.params.anvId)
//     // 404???
//     if (p == undefined) {
//         res.status(404).send('Finns inte')
//     }
//     players.splice(players.indexOf(p), 1)
//     res.status(204).send('Deleted')
// });

app.delete('/api/players/:playerId',async (req,res)=>{
    const playerId = req.params.playerId
    try {
      const player = await Players.findOne({ where: { id:playerId } })
  
      await player.destroy()
  
      return res.json({ message: 'Player deleted!' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
});

app.put('/api/players/:playerId', async (req, res) => {
    const playerId = req.params.playerId
    const { name, jersey, position } = req.body

    try {
        const player = await Players.findOne({
            where: { id: playerId }
        })
        player.name = name
        player.jersey = jersey
        player.position = position

        await player.save()

        return res.status(204).json({ err: 'ok' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }

});

app.listen(port, async () => {
    await migrationhelper.migrate()
    await sequelize.authenticate()
    console.log(`Example app listening2 on port ${port}`)
})


