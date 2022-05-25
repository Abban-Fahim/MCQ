const form = document.getElementById("main");
const certForm = document.getElementById("cert");
const main = document.querySelector("main");
const msText = document.querySelector("code").innerHTML;

let marksObject = {}

form.onsubmit = (e) => {
  
};

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
    o[a1[i]] = a2[i]
  }
};

const interface = (num) => `
<div class="col-lg-4 col-md-6" id="questions">
  <h4 class="w-100">Question ${num}:</h4>
  <button class="btn option">A</button>
  <button class="btn option">B</button>
  <button class="btn option">C</button>
  <button class="btn option">D</button>
</div>
<div class="col-lg-8 col-md-6">
  <iframe width="100%" src="pdfjs/web/viewer.html?file=../../temp.pdf"></iframe>
</div>
`

function submitForCorrection() {
  
}
