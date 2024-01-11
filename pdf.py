import base64
from distutils.log import error
from PyPDF2 import PdfFileReader
import requests
from io import BytesIO
import re
import base64

def main(args):
    argA = str(args).split(" ")
    qualification = "Cambridge%20IGCSE"
    timings = "45:0"
    # Determines which subject is chosen
    code = argA[0]
    subject = ""
    if (code=="0610" or code=="9700"): subject = "Biology"
    elif (code=="0620" or code=="9701"): subject = "Chemistry"
    elif (code=="0625" or code=="9702"): subject = "Physics"
    elif (code=="0653"): subject = "Science - Combined"
    elif (code=="0455"): subject = "Economics"
    elif (code=="0452"): subject = "Accounting"

    if (int(code) >= 9700):
        qualification = "A%20Levels"
        timings = "75:0"
    # Some notes:
    # - Accounting MCQs only introduced in 2020
    # - Combined Science papers only availble form 2014 onwards

    year = int(argA[1])
    series = argA[2] # can be s (May-June), w (Oct-Nov), m (March)
    coreOrExtended = argA[3]
    variant = argA[4]
    
    # Old api endpoint for getting papers from GCE Guide, alas it was shut down
    # url = f"https://papers.gceguide.com/{qualification}/{subject}%20({code})/20{str(year)}/{code}_{series}{str(year)}_ms_{coreOrExtended}{variant}.pdf"
    
    url = f"https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/{code}_{series}{str(year)}_ms_{coreOrExtended}{variant}.pdf"

    req = requests.get(url, allow_redirects=True)
    if req.status_code != 200:
        return {"err": "Request Failed"}

    # extracts the contents of page 1 and 2, piss off pre-2017
    reader = PdfFileReader(BytesIO(req.content))
    num_of_pages = reader.numPages
    page1 = reader.pages[1]
    text = str(page1.extractText())
    if (year > 16): text += reader.pages[2].extractText()

    final_text = text
    final_text = text.replace("\n", "") # removes line breaks
    # for removing the extra 1s (marks!) in the table columns... just why, Cambridge, why?
    if (year > 19): # 2020 & 2021
        final_text = re.sub("[ ](1(?!\w))", "", final_text)
    elif (year > 16): # 2017 to 2019
        final_text = re.sub(" 1(\s*?)(?=[0-9])", " ", final_text)

    if (year>16):
        final_text = re.sub(f"{code}(.*?)Marks", "", final_text) # removes uneccesaary header text 
        final_text = re.sub("[ ]{2,}", " ", final_text) # replaces any occurences of multiple spaces
    else:
        final_text = re.sub("Page(.*?)Key(?!.*Key)", "", final_text) # removes uneccesaary header text pre-2017
        final_text = re.sub("[ ]{2,}", " ", final_text)
    final_text = final_text.replace(" ", ",")

    formattingDone = True
    # modify last or first point of array for any extra ones
    while formattingDone == True:
        listOfText = list(final_text)
        numOfEl = len(listOfText) - 1
        formattingDone = False
        if (listOfText[0] == ","):
            # print("removed , from start")
            listOfText[0] = ""
            formattingDone = True; 
            final_text = "".join(listOfText); continue
        if (listOfText[0] != "1"):
            # print("added 1")
            listOfText.insert(0, '1,')
            formattingDone = True
        if (listOfText[numOfEl] == ","): 
            # print("removed , from end")
            listOfText[numOfEl] = ""
            formattingDone = True
        if (listOfText[numOfEl] == "1"):
            # print("removed 1") 
            listOfText[numOfEl] = ""
            formattingDone = True
        final_text = "".join(listOfText)

    # QPreq = requests.get(f"https://papers.gceguide.com/{qualification}/{subject}%20({code})/20{str(year)}/{code}_{series}{str(year)}_qp_{coreOrExtended}{variant}.pdf")
    QPreq = requests.get(f"https://pastpapers.papacambridge.com/directories/CAIE/CAIE-pastpapers/upload/{code}_{series}{str(year)}_qp_{coreOrExtended}{variant}.pdf")
    
    if QPreq.status_code != 200:
        return {"err": "Request Failed"}
    
    qpFile = base64.b64encode(QPreq.content)
    paperName = f"{code} {subject} {coreOrExtended}{variant}, {series}-20{str(year)}"
    # qpFile = QPreq.content

    return [final_text, qpFile, paperName, timings]
