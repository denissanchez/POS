import express from "express";


const app = express();
const port = process.env.PORT || 8080;


app.get('/', function(req, res) {
    res.json({
        ok: true   
    })
});

app.listen(port);
console.log('Listen on port ' + port);
