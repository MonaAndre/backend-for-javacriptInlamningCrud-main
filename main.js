const express = require('express')
const app = express()
const port = 3000 // "Radiofrekvens"
const cors = require ('cors')

app.use(cors())

const players = [{
    name: "Stefan",
    jersey:2,
    age:51,
    id:1,
    team: "team",
    matches:"matches",
    visible: true,
    position: "position"
},{
    name: "Foppa",
    jersey:21,
    age:51,
    id:2,
    team: "team",
    matches:"matches",
    visible: true,
    position: "position"
},
{
    name: "Sudden",
    jersey:13,
    age:52,
    id:3,
    team: "team",
    matches:"matches",
    visible: true,
    position: "position"
}]

// /api/players/1
// /api/players/2
app.get('/api/players/:anvId',(req,res)=>{
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
    if(p == undefined){
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

app.get('/api/players',(req,res)=>{
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
    
    let result = players.map(p=>({
        id: p.id,
        name: p.name,
        matches: p.matches,
        visible: p.visible,
        team: p.team
    }))
     res.json(result)
});


app.get('/api/updatestefan',(req,res)=>{
    players[0].age = players[0].age + 1
    res.send('KLART2');
});



// app.post('/api/players',(req,res)=>{

// });



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  