const cp = require("child_process");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static('static'));

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

// executing commadns like "py pdf.py 0625 22 s (1/2) (1/2/3)"
const command = 'py pdf.py 0625 21 s 2'

cp.exec(command, (err, out, stderr)=>{
    if (err) {
        console.error(err);
    } else {
        console.log(stderr);
        console.log(out);
    }
});

app.listen('3000', ()=>{console.log('server started')})