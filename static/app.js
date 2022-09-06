const questionsDiv = document.querySelector("h4");
const alertBox = document.getElementById("alert");
const msText = document.querySelector("code").innerHTML;
const pdfArrayBuffer = document.getElementById("viewer");
const timer = document.querySelector("time");
const timerBtn = document.getElementById("timerBtn");

let marksObject = {};
let questionNum = 1;
let numCorrect = 0;
let numWrong = 0;
let isPaused = true;
let finished = false;

let pdfBlob = new Blob([[pdfArrayBuffer.innerHTML]], {
  type: "application/pdf",
});
let pdfFile = URL.createObjectURL(pdfBlob);
console.log(pdfFile);
pdfArrayBuffer.innerHTML = pdfViewer(pdfArrayBuffer.innerHTML.slice(2, pdfArrayBuffer.innerHTML.length - 1));
// pdfArrayBuffer.innerHTML = pdfViewer(pdfFile);

function populateMarksObject(t) {
  a = t.split(",");
  a1 = [];
  a2 = [];
  marksObject = {};
  for (i = 0; i < a.length; i++) {
    if (i % 2 === 0) {
      a1.push(a[i]);
    } // even items - question numbers
    else {
      a2.push(a[i]);
    } // odd items - answers
  }
  for (i = 0; i < 40; i++) {
    if (i === 39) {
      a2[i] = a2[i].replace("\n", "");
    }
    marksObject[a1[i]] = a2[i];
  }
}

populateMarksObject(msText);
questionsDiv.innerHTML = questions(questionNum, numCorrect, numWrong);
const btns = document.querySelectorAll(".option");
btns.forEach((btn) => {
  btn.addEventListener("click", onClick);
});

timerBtn.addEventListener("click", (e) => {
  if (e.target.innerHTML !== "Pause") {
    e.target.innerHTML = "Pause";
    isPaused = false; // start the timer
  } else {
    e.target.innerHTML = "Resume";
    isPaused = true; // stop the timer
  }
});

function onClick(e) {
  if (marksObject[questionNum] === e.target.id) {
    numCorrect++;
    alertBox.innerHTML = alertHTML("success");
  } else {
    numWrong++;
    alertBox.innerHTML = alertHTML("danger");
    document.getElementById(marksObject[questionNum]).classList.add("correct");
  }
  setTimeout(() => {
    alertBox.innerHTML = "";
    document.querySelector(".correct").setAttribute("class", "btn option");
  }, 1000);
  increaseNum();
}

function increaseNum() {
  if (questionNum === 40) {
    questionsDiv.innerHTML = questions(40, numCorrect, numWrong);
    alert(`GREAT JOB! You got ${Math.floor((numCorrect / 40) * 100)}% correct.`);
    console.log(Math.floor(numCorrect / 40), numCorrect / 40);
  } else {
    questionNum++;
    questionsDiv.innerHTML = questions(questionNum, numCorrect, numWrong);
  }
}

setInterval(() => {
  if (!isPaused && !finished) {
    t = timer.innerHTML.split(":");
    mins = Number(t[0]);
    secs = Number(t[1]);
    if (secs === 0) {
      secs = 59;
      if (mins === 0) {
        alert("Time is over!");
        finished = true;
        mins = 0;
        secs = 0;
      } else mins--;
    } else secs--;
    timer.innerHTML = `${mins}:${secs}`;
  }
}, 1000);
