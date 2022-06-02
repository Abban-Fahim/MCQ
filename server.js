const cp = require("child_process");
const express = require("express");

// setting up expressJS application
const app = express();
app.use(express.json());
app.use(express.static('static'));
app.set('view engine', 'ejs');

// main route to serve file
app.get("/", (req,res)=>{res.render("index")})

app.get('/paper/:paperDet', (req,res)=>{
    if (req.params.paperDet.slice(0,2) === "06") {
        cp.exec("python pdf.py " + req.params.paperDet, (err, out, stderr)=>{ // executing commands like "python pdf.py 0625 22 (s/m/w) (1/2) (1/2/3)"
            if (err) {
                console.error(err);
            } else {
                console.log(stderr);
                console.log(out);
                res.render("paper", {ms: out})
            }
        });
    }
});

app.listen(process.env.PORT || '3000', ()=>{console.log('server started')})