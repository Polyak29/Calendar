const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const jsonParser = bodyParser.json();

app.use(express.static(__dirname));
app.set('port', 8080);

app.get("/api/users", (req, res) => {
    const fileData = fs.readFileSync("config.json", "utf8");
    // const config = JSON.parse(fileData);
    res.send(fileData);
});

app.post("/api/users", jsonParser, function (req, res) {
    if(!req.body) return res.sendStatus(400);

    const data = JSON.stringify(req.body);

    fs.writeFileSync("config.json", data);
    res.send(data);
});

app.listen(app.get('port'), () =>{
    console.log(`server worked`);
});

// app.put("/api/users", jsonParser,  (req, res) => {
//     if(!req.body) return res.sendStatus(400);
//
//     const fileData = fs.readFileSync("config.json", "utf8");
//     const config = JSON.parse(fileData);
//     const idTask = req.body.idTask;
//     const checked = req.body.checked;
//
//     const task = config.find( value => (value.id === idTask));
//     task.isDone = checked;
//
//     const data = JSON.stringify(config);
//
//     fs.writeFileSync("config.json", data);
//     res.send(data);
// });

// app.get("/api/users/:id", (req, res) => {
//     fs.readFile("users.json", "utf8", (err, data) => {
//         if (err) return res.status(404).send(err);
//         const user = JSON.parse(data).filter(e => e.id === +req.params.id);
//         user.length ? res.send(JSON.stringify(user)) : res.status(404).send();
//     });
// });
//
// app.post("/api/users", jsonParser, (req, res) => {
//     if (!req.body) return res.sendStatus(400);
//     fs.readFile("users.json", 'utf8', (err, data) => {
//         if (err) return res.status(404).send(err);
//         const { age, name } = req.body;
//         const user = { name, age };
//         const users = JSON.parse(data);
//         user.id = Math.max.apply(Math, users.map((e) => e.id)) + 1;
//         users[users.length] = user;
//         fs.writeFile("users.json", JSON.stringify(users), err => {
//             if (err) return res.status(404).send(err);
//             res.send(JSON.stringify(users));
//         })
//     })
// });
//
// app.put("/api/users", jsonParser, (req, res) => {
//     if (!req.body) return res.sendStatus(400);
//     fs.readFile("users.json", "utf8", (err, data) => {
//         if (err) return res.status(404).send(err);
//         const user = JSON.parse(data);
//         if (req.body.id <= user.length && req.body.id >= 0) {
//             user.splice(req.body.id, 0, req.body)
//             const users = user.map((e, i) => {
//                 e.id = i;
//                 return e;
//             });
//             fs.writeFile("users.json", JSON.stringify(users), err => {
//                 if (err) return res.status(404).send(err);
//                 res.send(JSON.stringify(users));
//             })
//
//         } else {
//             return res.status(404).send(err);
//         }
//         res.send(JSON.stringify(user));
//     });
// });
//
//

