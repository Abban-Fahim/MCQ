const form = document.getElementById("main");
const certForm = document.getElementById("cert");
const main = document.querySelector("main");

const tableHTML = (body) => `
<table class="table table-dark table-striped table-hover">
<thead>
  <tr>
    <th scope="col">#</th>
    <th scope="col">A</th>
    <th scope="col">B</th>
    <th scope="col">C</th>
    <th scope="col">D</th>
  </tr>
</thead>
<tbody>
${body}
</tbody>
</table>
<div class="d-grid gap-2">
<button class="btn btn-success btn-lg mb-3" type="button">DONE!</button>
</div>
`;

const tableRow = (num, data) => `
<tr>
<th scope="row">${num}</th>
${data}
</tr>
`;

const optionRadio = (num) => `
<td class="form-check">
    <input
      class="form-check-input"
      type="radio"
      name="${num}"
    />
</td>
`;

const marksForm = `
<div class="mb-3" id="marks">
        <label for="title" class="form-label">
          How many marks did u get?
        </label>
        <input
          required
          type="number"
          id="marks-num"
          name="marks"
          class="form-control"
        />
      <button class="btn btn-primary" type="submit">Generate Certificate?!</button>
      </div>
`;

form.onsubmit = (e) => {
  e.preventDefault();
  let titleOFmcq = e.target.question;
  let numOfquestions = e.target.number;
  let bodyHTML = "";
  for (let i = 1; i <= numOfquestions.value; i++) {
    let options = "";
    for (let j = 0; j < 4; j++) {
      options += optionRadio(i);
    }
    bodyHTML += tableRow(i, options);
  }
  titleOFmcq.setAttribute("readonly", "true");
  numOfquestions.setAttribute("readonly", "true");
  main.innerHTML = tableHTML(bodyHTML);
  main.scrollIntoView(true);
  document
    .querySelector(".btn-success")
    .addEventListener("click", submitForCorrection);
};

certForm.onsubmit = (e) => {
  e.preventDefault();
  let marks = e.target.marks.value;
  let title = form.childNodes[1].childNodes[3].value;
  let total = form.childNodes[3].childNodes[3].value;
  window.open(
    `https://abban-fahim.github.io/MCQ/certificate.html?marks=${marks}&title=${title}&total=${total}`
  );
};

function submitForCorrection() {
  let radios = document.querySelectorAll(".form-check-input");
  for (i in radios) {
    radios[i].disabled = true;
  }
  certForm.innerHTML = marksForm;
}
