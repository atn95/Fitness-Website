//https://docs.google.com/spreadsheets/d/13ziuTPB171zB5CGR2Q8qZ2wqtUBcgW1ZKSvvJXTbPbE/

const url = `https://docs.google.com/spreadsheets/d/`;
const sheetID = `13ziuTPB171zB5CGR2Q8qZ2wqtUBcgW1ZKSvvJXTbPbE`;
const query = `/gviz/tq?`;

const dataJsonLink = `${url}${sheetID}${query}`;

let dataJson;

async function fetchJson(id, sheetQuery) {
    try {
        const response = await fetch(id + sheetQuery);
        const data = await response.text();
        return data;
    } catch (error) {
    }
}

async function loadFAQData() {
    dataJson = await fetchJson(dataJsonLink, `sheet=faq`);
    dataJson = JSON.parse(dataJson.substring(47).slice(0, -2));

    let QnA = [];
    dataJson.table.rows.forEach((row) => {
        let tempData = [];
        row.c.forEach((cell) => {
            tempData.push(cell.v);
            // const output = document.createElement("p");
            // output.classList.add("faq");
            // output.classList.add("med-text");
            // output.innerHTML = cell.v + "<br>";
            // outputArea.appendChild(output);
        });
        let tempObj = { question: tempData[0], answer: tempData[1] };
        QnA.push(tempObj);
    });
    writeFAQHtml(QnA);
}

function writeFAQHtml(QnA) {
    const outputArea = document.querySelector("#faq");
    for (let i = 1; i < QnA.length; i++) {
        const output = document.createElement("div");
        output.classList.add("faq");
        //write p tag for question
        const outputQ = document.createElement("p");
        outputQ.classList.add("small-text");
        outputQ.innerHTML = QnA[i].question;
        output.appendChild(outputQ);

        //write p tag for answer
        const outputA = document.createElement("p");
        outputA.classList.add("small-text");
        outputA.innerHTML = QnA[i].answer;
        output.appendChild(outputA);

        //console.log(outputQ.innerHTML);
        outputArea.appendChild(output);
    }
}


async function loadClientData() {
    dataJson = await fetchJson(dataJsonLink, `sheet=data`);
    dataJson = JSON.parse(dataJson.substring(47).slice(0, -2));
    let tempClients = [];
    let clientCount = 0;
    dataJson.table.rows.forEach((row) => {
        let rowData = row.c
        let tempObjData = [];
        if (clientCount < 3) {
            clientCount++;
        }
        if (clientCount % 3 != 0) {
            clientCount %= 3;
        } else {
            clientCount = 0;
        }
        rowData.forEach((cell) => {
            //console.log(cell.v);
            tempObjData.push(cell.v);
        });
        if (tempObjData[3] !== 'highlight') {
            let tempObj = { image: tempObjData[0], decription: tempObjData[1], fullName: tempObjData[2], highlight: (tempObjData[3] == 'y') ? true : false };
            tempClients.push(tempObj);
            //console.log(tempClients[0]);
            //createHtml(tempObj);
        }
    });
    createHtml(tempClients);
    //console.log(dataJson);
    //dataJson = JSON.parse(dataJsonTxt);
}

function createHtml(clients) {
    let highlighted = [];
    let normal = [];
    for (let i = 0; i < clients.length; i++) {
        if (clients[i].highlight) {
            highlighted.push(clients[i]);
        } else {
            normal.push(clients[i]);
        }
    }
    createHighlightedClient(highlighted);
    createNormalClient(normal);
}

function createHighlightedClient(clients) {
    const output = document.querySelector('.highlight');
    let displayHTML = '';
    for (let i = 0; i < clients.length; i++) {
        //create container to hold everything
        const displayBlock = document.createElement("div");
        displayBlock.classList.add("top-testimony");

        //createing container for img
        const clientImageBlock = document.createElement("div");
        clientImageBlock.classList.add("testi-pic");
        clientImageBlock.classList.add("left");

        //creating image tag
        const img = document.createElement("img");
        img.src = `${clients[i].image}`;
        //console.log(clients[i].image);
        img.alt = "Client before annd after";
        img.style.width = "100%";
        img.style.height = "100%";
        //create quoteArea
        const quoteArea = document.createElement("div");
        quoteArea.classList.add("testi-quote-area");
        quoteArea.classList.add("right");
        quoteArea.innerHTML = clients[i].decription + " <br>" + clients[i].fullName;

        //adding img to img container
        clientImageBlock.appendChild(img);

        //adding everything to main container
        displayBlock.appendChild(clientImageBlock);
        displayBlock.appendChild(quoteArea);
        output.appendChild(displayBlock);
    }

    document.querySelector("#top-amount").innerHTML = clients.length;
}

function createNormalClient(clients) {
    const outputArea = document.querySelector(".more-trans");
    let count = 0;
    let threeClientBox;
    for (let i = 0; i < clients.length; i++) {
        //console.log(count);
        if (count % 3 == 0) {
            //Create big box holding 3 client
            threeClientBox = document.createElement("div");
            threeClientBox.classList.add("allclient-box");
        }
        count++;
        let clientBox = document.createElement("div");
        clientBox.classList.add("clientbox");

        //holds the iamge container
        let clientImageBox = document.createElement("div");
        clientImageBox.classList.add("clientbox-container");

        //box holding image
        let imageBox = document.createElement("div");
        imageBox.classList.add("clientbox-component");

        //image element
        let img = document.createElement("img");
        img.src = `${clients[i].image}`;
        img.alt = "Client before annd after";
        img.style.width = "100%";
        img.style.height = "100%";

        //create quote container
        let quoteContainer = document.createElement("div");
        quoteContainer.classList.add("clientbox-container");

        //quote area
        let quoteArea = document.createElement("div");
        quoteArea.classList.add("clientbox-component");
        quoteArea.innerHTML = clients[i].decription + " <br>" + clients[i].fullName;

        //adding img to holding box
        imageBox.appendChild(img);

        //adding imgbox to container
        clientImageBox.appendChild(imageBox);

        //adding quoteArea to quote container
        quoteContainer.appendChild(quoteArea);

        //adding both to main container
        clientBox.appendChild(clientImageBox);
        clientBox.appendChild(quoteArea);
        threeClientBox.appendChild(clientBox);
        if (count == 3 || i == clients.length - 1) {
            outputArea.appendChild(threeClientBox);
        }
    }
}

loadClientData();
loadFAQData();