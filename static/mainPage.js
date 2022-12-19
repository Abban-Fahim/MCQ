const alertBox = document.getElementById("alert");
const form = document.getElementById("main");

form.onsubmit = (e) => {
  e.preventDefault();
  console.log(
    e.target.subject.value,
    e.target.level.value,
    e.target.year.value,
    e.target.series.value,
    e.target.variant.value
  );
  let s = e.target.subject.value;
  let y = e.target.year.value - 2000;
  let d = y < 16 ? "1" : e.target.level.value === "Core" ? "1" : "2";
  let t = e.target.series.value;
  let v = e.target.variant.value;
  // Conditionals here for validating form
  if (t === "m" && v !== "2") {
    console.log(t, v);
    e.target.variant.value = 2;
    reportError("March series only has variant 2s.");
    return;
  }
  if (s >= 9700) {
    d = 1;
  }
  let stringForServer = `${s} ${y} ${t} ${d} ${v}`;
  window.location.href = window.location.protocol + "//" + window.location.host + "/paper/" + stringForServer;
};

function reportError(message) {
  alertBox.innerHTML = `<div class="alert alert-danger">${message}</div>`;
  setTimeout(() => {
    alertBox.innerHTML = "";
  }, 7000);
}
