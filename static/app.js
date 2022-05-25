const main = document.querySelector("main");
const msText = document.querySelector("code").innerHTML;

let marksObject = {};
let QuestionNum = 1;

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
main.innerHTML = interface(QuestionNum);
  
function submitForCorrection() {}