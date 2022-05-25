const cp = require("child_process");
const express = require("express");

// setting up expressJS application
const app = express();
app.use(express.json());
app.use(express.static('static'));
app.set('view engine', 'ejs');

// executing commadns like "py pdf.py 0625 22 s (1/2) (1/2/3)"
const command = 'py pdf.py 0625 21 s 2 2'

// main route to serve file
app.get('/', (req,res)=>{
    cp.exec(command, (err, out, stderr)=>{
        if (err) {
            console.error(err);
        } else {
            console.log(stderr);
            res.render("index", {ms: out})
        }
    });
});

app.listen('3000', ()=>{console.log('server started')})