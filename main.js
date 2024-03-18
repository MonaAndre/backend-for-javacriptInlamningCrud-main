const express = require('express')
const app = express()
const port = 3000 // "Radiofrekvens"
const cors = require('cors')
const bodyParser = require('body-parser')
const { Op } = require('sequelize')
const { sequelize, Players } = require('./models')
const migrationhelper = require('./migrationhelper')
const { check, validationResult } = require('express-validator')
const { validateCreatePlayer } = require('./validators/playerValidators')

app.use(cors())
app.use(bodyParser.json())

app.get('/api/players', async (req, res) => {

    const sortCol = req.query.sortCol || 'id';
    const sortOrder = req.query.sortOrder || 'asc';
    const q = req.query.q || '';
    const offset = Number(req.query.offset || 0);
    const limit = Number(req.query.limit || 20);
    const players = await Players.findAndCountAll({
        where: {
            name: { [Op.like]: '%' + q + '%' }
        },
        order: [
            [sortCol, sortOrder]
        ],

        offset: offset,
        limit: limit

    })
    const total = players.count
    const result = players.rows.map(p => {
        return {
            id: p.id,
            name: p.name,
            jersey: p.jersey,
            position: p.position
        }
    })
    return res.json({
        total,
        result
    })
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

app.post('/api/players', validateCreatePlayer, async (req, res) => {

    const { name, jersey, position, } = req.body
    try {
        const player = await Players.create({ name, jersey, position })
        res.status(201).send('Created')
    } catch (err) {
        console.log(err)
        return res.status(500).json(err)
    }
});

app.delete('/api/players/:playerId', async (req, res) => {
    const playerId = req.params.playerId
    try {
        const player = await Players.findOne({ where: { id: playerId } })

        await player.destroy()

        return res.json({ message: 'Player deleted!' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
});

app.put('/api/players/:playerId', validateCreatePlayer, async (req, res) => {
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