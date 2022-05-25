const pdfDiv = document.getElementById("viewer");
const questionsDiv = document.querySelector("h4");
const alertBox = document.getElementById("alert");
const msText = document.querySelector("code").innerHTML;

let marksObject = {};
let questionNum = 1;
let numCorrect = 0;
let numWrong = 0;

function populateMarksObject (t) {
    a = t.split(',');
    a1 = [];
    a2 = [];
    marksObject = {}
    for (i=0; i<a.length; i++) {
      if (i % 2 === 0) {a1.push(a[i])}
      else {a2.push(a[i])}
    }
    for (i=0; i<40; i++) {
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
        alertBox.innerHTML = alertHTML("success");
    } else {
        numWrong++;
        alertBox.innerHTML = alertHTML("danger");
    }
    setTimeout(()=>{alertBox.innerHTML = ""}, 1000)
    increaseNum();
};

function increaseNum () {
    if (questionNum===40){
        // end the paper, show results
    } else {
        questionNum++;
        questionsDiv.innerHTML = questions(questionNum, numCorrect, numWrong);
    }
};