from flask import Flask, render_template, send_file
import pdf

app = Flask(__name__)

@app.route("/")
def main():
    return render_template("index.html")

@app.route("/paper/<paperDetails>")
def servePaper(paperDetails):
    scriptOut = pdf.main(paperDetails)
    markSchemeText = scriptOut[0]
    qpFile = scriptOut[1]

    return render_template("paper.html", ms=markSchemeText, pdfFile=qpFile)
