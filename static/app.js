const questionsDiv = document.querySelector("h4"); // Question number display
const alertBox = document.getElementById("alert"); // Alerts whether answer is wrong or right
const msText = document.querySelector("code").innerHTML; // Contains data for markScheme
const pdfArrayBuffer = document.getElementById("pdfArrayBuffer"); // Contains data for pdf binary
const timer = document.querySelector("time"); // Timer display
const timerBtn = document.getElementById("timerBtn"); // Timer controls
const pdfViewer = document.querySelector("canvas"); // Canvas for displaying pdf
const prevBtn = document.getElementById("prev"); // Previous page for pdf
const nextBtn = document.getElementById("next"); // Next page for pdf
const zoomInBtn = document.getElementById("zoomIn"); // Zoom into the pdf
const zoomOutBtn = document.getElementById("zoomOut"); // Next out of the pdf

// Variables for PDF Viewer
let pdfDoc = null;
const pdfjsLib = window["pdfjs-dist/build/pdf"];
const pdfCtx = pdfViewer.getContext("2d");
const scale = 2;
let pdfZoom = 100;
let pageNum = 1;
let isRendering = false;
let pageQueue = null;

// Variables for app functionality
let marksObject = {};
let questionNum = 1;
let numCorrect = 0;
let numWrong = 0;
let isPaused = true;
let finished = false;

// PDF Viewer functionality. See: https://mozilla.github.io/pdf.js/examples/
pdfjsLib.GlobalWorkerOptions.workerSrc = window["pdfjs-dist/build/pdf.worker"];
const pdf = atob(pdfArrayBuffer.innerHTML.slice(2, pdfArrayBuffer.innerHTML.length - 1));
pdfArrayBuffer.innerHTML = "";
console.log(pdfjsLib);

// Renders a page, and another if it's queued
function renderPage(num) {
	isRendering = true;
	pdfDoc.getPage(num).then((page) => {
		let viewport = page.getViewport({ scale: scale });
		pdfViewer.height = viewport.height;
		pdfViewer.width = viewport.width;
		page.render({ canvasContext: pdfCtx, viewport: viewport }).promise.then(() => {
			console.log("Page rendered!");
			isRendering = false;
			if (pageQueue !== null) {
				renderPage(pageQueue);
				pageQueue = null;
			}
		});
	});
}

// Queues up a page to render if one is already rendering
function queueRender(num) {
	if (isRendering) {
		pageQueue(num);
	} else {
		renderPage(num);
	}
}

// Event listeners for pdf controls
prevBtn.addEventListener("click", () => {
	if (pageNum > 1) {
		pageNum--;
		queueRender(pageNum);
	}
});
nextBtn.addEventListener("click", () => {
	if (pageNum < pdfDoc.numPages) {
		pageNum++;
		queueRender(pageNum);
	}
});

function setPdfZoom() {
	pdfViewer.style.width = `${pdfViewer.width * (pdfZoom / 100)}px`;
	pdfViewer.style.height = `${pdfViewer.height * (pdfZoom / 100)}px`;
}
zoomInBtn.addEventListener("click", () => {
	pdfZoom *= 1.05;
	setPdfZoom();
});
zoomOutBtn.addEventListener("click", () => {
	pdfZoom /= 1.05;
	setPdfZoom();
});

// Initial/first page rendering and download whole pdf
pdfjsLib.getDocument({ data: pdf }).promise.then(function (pdfDoc_) {
	pdfDoc = pdfDoc_;
	renderPage(pageNum);
});

// App functionality
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

/**
 *
 * @param {Event} e
 */
function onClick(e) {
	if (marksObject[questionNum] === e.target.id) {
		numCorrect++;
		alertBox.innerHTML = alertHTML("success");
	} else {
		numWrong++;
		alertBox.innerHTML = alertHTML("danger");
		document.getElementById(e.target.id).classList.add("correct");
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

// Timer functionality
timerBtn.addEventListener("click", (e) => {
	if (e.target.innerHTML !== "Pause") {
		e.target.innerHTML = "Pause";
		isPaused = false; // start the timer
	} else {
		e.target.innerHTML = "Resume";
		isPaused = true; // stop the timer
	}
});

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
