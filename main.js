const express = require('express')
const app = express()
const port = 3000 // "Radiofrekvens"
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())

const players = [{
    name: "Stefan",
    jersey: 2,
    age: 51,
    id: 1,
    team: "team",
    matches: "matches",
    visible: true,
    position: "position"
}, {
    name: "Foppa",
    jersey: 21,
    age: 51,
    id: 2,
    team: "team",
    matches: "matches",
    visible: true,
    position: "position"
},
{
    name: "Sudden",
    jersey: 13,
    age: 52,
    id: 3,
    team: "team",
    matches: "matches",
    visible: true,
    position: "position"
}]

function getNextId(){
    let m = Math.max(...players.map(player => player.id))
    return m + 1
}

// /api/players/1
// /api/players/2
app.get('/api/players/:anvId', (req, res) => {
    console.log(req.params.anvId)
    // req.params.anvId är ju id:t 3,
    // for(let p : players){

    // }
    // let resultingPlayer = undefined
    // for(let i = 0; i < players.length;i++) {
    //     let player = players[i];
    //     if(player.id == req.params.anvId){
    //         resultingPlayer = player
    //         break
    //     }
    // }
    // res.json(resultingPlayer)
    const playerId = parseInt(req.params.anvId);

    let p = players.find(player => player.id === playerId);

    // 404???
    if (p == undefined) {
        res.status(404).send('Finns inte')

    }
    res.json(p)
});



// app.get('/api/players/1',(req,res)=>{
//     res.json(players[0])
// });

// app.get('/api/players/2',(req,res)=>{
//     res.json(players[1])
// });

// app.get('/api/players/3',(req,res)=>{
//     res.json(players[2])
// });

app.get('/api/players', (req, res) => {
    // let result = []
    // for(let i = 0; i < players.length;i++) {
    //     let player = players[i];
    //     let obj = {
    //         id:player.id,
    //         name: player.name
    //     }
    //     result.push(obj)
    // }
    // res.json(result)

    let result = players.map(p => ({
        id: p.id,
        name: p.name,
        matches: p.matches,
        visible: p.visible,
        team: p.team
    }))
    res.json(result)
});


// app.get('/api/updatestefan', (req, res) => {
//     players[0].age = players[0].age + 1
//     res.send('KLART2');
// });


// att kunnna lägga till ny spelare 
//http post

app.post('/api/players', (req, res) => {
    console.log(req.body);
    // Validate the "jersey" field
    const newPlayer = {
        name: req.body.name,
        jersey: req.body.jersey,
        age: req.body.age,
        team: req.body.team,
        visible: req.body.visible,
        matches: req.body.matches,
        position: req.body.position,
        id: getNextId()
    }
    players.push(newPlayer);
    res.status(201).send('Created');
});


app.delete('/api/players/:anvId',(req,res)=>{
    console.log(req.params.anvId)
    let p = players.find(player=>player.id == req.params.anvId)
    // 404???
    if(p == undefined){
        res.status(404).send('Finns inte')
    }
    players.splice(players.indexOf(p),1)
    res.status(204).send('Deleted')    
});

app.put('/api/players/:anvId', (req, res) => {
// uppdatera -replace hela obj
// app.patch kan vara bra om man ändrar inte alla propertyis 
const playerId = parseInt(req.params.anvId);
let p = players.find(player => player.id === playerId);

// 404???
if (p == undefined) {
    res.status(404).send('Finns inte')
return;
}
p.name = req.body.name;
p.jersey = req.body.jersey;
p.age = req.body.age;
p.team = req.body.team;
p.visible = req.body.visible;
p.position = req.body.position;
p.matches = req.body.matches;

res.status(204).send('Updated');

});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});


