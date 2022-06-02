const pdfDiv = document.getElementById("viewer");
const questionsDiv = document.querySelector("h4");
const alertBox = document.getElementById("alert");
const msText = document.querySelector("code").innerHTML;

let marksObject = {};
let questionNum = 1;
let numCorrect = 0;
let numWrong = 0;

function populateMarksObject (t) {
    console.log(t);
    a = t.split(',');
    a1 = [];
    a2 = [];
    marksObject = {}
    for (i=0; i<a.length; i++) {
      if (i % 2 === 0) {a1.push(a[i])} // even items - question numbers
      else {a2.push(a[i])} // odd items - answers
    }
    console.log(a1, a2)
    for (i=0; i<40; i++) {
      if (i===39) {a2[i] = a2[i].replace('\n', '')}
      marksObject[a1[i]] = a2[i]
    }
};

populateMarksObject(msText);
questionsDiv.innerHTML = questions(questionNum, numCorrect, numWrong);
pdfDiv.innerHTML = pdfViewer;
const btns = document.querySelectorAll('button');
btns.forEach((btn)=>{btn.addEventListener('click', onClick)});

function onClick(e) {
    if (marksObject[questionNum] === e.target.id) {
        numCorrect++;
        console.log('hmmmmm')
        alertBox.innerHTML = alertHTML("success");
    } else {
        numWrong++;
        console.log('ahahaha dumm')
        alertBox.innerHTML = alertHTML("danger");
        document.getElementById(marksObject[questionNum]).classList.add("correct")
    }
    console.log(marksObject)
    setTimeout(()=>{
        alertBox.innerHTML = "";
        document.querySelector(".correct").setAttribute("class", "btn option");
    }, 1000)
    increaseNum();
};

function increaseNum () {
    if (questionNum===40){
        console.log('lol')
    } else {
        questionNum++;
        questionsDiv.innerHTML = questions(questionNum, numCorrect, numWrong);
    }
};