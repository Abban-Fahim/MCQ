const form = document.getElementById("main");
const certForm = document.getElementById("cert");

form.onsubmit = (e) => {
  e.preventDefault();
  console.log(e.target.subject.value, e.target.level.value, e.target.year.value, e.target.series.value, e.target.variant.value)
  let s = e.target.subject.value; 
  let y = String(e.target.year.value - 2000);
  let d = y < 16 ? "1" : e.target.level.value === "Core" ? "1" : "2"; 
  let t = e.target.series.value;
  let v = t==="m" ? "2" : String(e.target.variant.value);
  let stringForServer = `${s} ${y} ${t} ${d} ${v}`;
  window.location.href = window.location.protocol + "//" + window.location.host + "/paper/" + stringForServer;
};