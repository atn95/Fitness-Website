//https://docs.google.com/spreadsheets/d/13ziuTPB171zB5CGR2Q8qZ2wqtUBcgW1ZKSvvJXTbPbE/

const url = `https://docs.google.com/spreadsheets/d/`;
const sheetID = `13ziuTPB171zB5CGR2Q8qZ2wqtUBcgW1ZKSvvJXTbPbE`;
const query = `/gviz/tq?`;
const scrollTopBtn = document.querySelector(`#scroll-top`);
const scrollBotBtn = document.querySelector(`#scroll-bottom`);

let clientList = [];
let mobile = window.matchMedia('screen and (max-width:600px)').matches;
let mouseDown = false;
let scrollDirection = 0;

let youtube, facebook, instagram;

const sheetsData = `${url}${sheetID}${query}`;

async function fetchJson(id, sheetQuery) {
	try {
		const response = await fetch(id + sheetQuery);
		const data = await response.text();
		let parsedData = JSON.parse(data.substring(47).slice(0, -2)).table.rows;
		return parsedData;
	} catch (error) {}
}

async function loadConfigs() {
	let config = await fetchJson(sheetsData, `sheet=config`);
	console.log(`config`, config);
	let faviconLink = config[0].c[1].v;
	let header = config[1].c[1].v;
	let subhead = config[2].c[1].v;
	let welcomeMsg = config[3].c[1].v;
	let youtubeVidId = config[4].c[1].v;
	youtube = config[5].c[1].v;
	facebook = config[6].c[1].v;
	instagram = config[7].c[1].v;
	let commonMistakes = [];
	for (let i = 8; i < config.length; i += 2) {
		let mistakes = {
			mistake: config[i].c[1].v,
			solution: config[i + 1].c[1].v,
		};
		commonMistakes.push(mistakes);
	}
	loadFavicon(faviconLink, header);
	loadHeader(header, subhead);
	createWelcomeMessage(welcomeMsg);
	writeCommonProbsSol(commonMistakes);
	writeYoutubeVid(youtubeVidId);
}

async function loadFAQData() {
	let faqs = await fetchJson(sheetsData, `sheet=faq`);

	let QnA = [];
	faqs.forEach((row) => {
		let tempData = [];
		row.c.forEach((cell) => {
			tempData.push(cell.v);
		});
		let tempObj = { question: tempData[0], answer: tempData[1] };
		QnA.push(tempObj);
	});
	writeFAQHtml(QnA);
}

async function loadClientData() {
	let allClients = await fetchJson(sheetsData, `sheet=data`);
	let clientCount = 0;
	allClients.forEach((row) => {
		let rowData = row.c;
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
			tempObjData.push(cell.v);
		});
		if (tempObjData[3] !== 'highlight') {
			let tempObj = {
				image: tempObjData[0],
				decription: tempObjData[1],
				fullName: tempObjData[2],
				highlight: tempObjData[3] == 'y' ? true : false,
			};
			clientList.push(tempObj);
		}
	});
	createHtml(clientList);
}

function loadHeader(header, subheader) {
	document.querySelector(`#site-title`).innerHTML = header;
	document.querySelector(`#site-subtitle`).innerHTML = subheader;
}

function loadFavicon(iconLink, webTitle) {
	const link = document.createElement(`link`);
	link.id = `favicon`;
	link.rel = `shortcut icon`;
	link.href = iconLink;
	const title = document.createElement(`title`);
	title.innerText = webTitle;
	document.head.append(link);
	document.head.append(title);
}

function writeCommonProbsSol(problems) {
	problems.forEach((prob) => {
		let probDiv = document.querySelector(`#prob${problems.indexOf(prob)}`);
		let solutionDiv = document.querySelector(
			`#solution${problems.indexOf(prob)}`
		);
		let motivationBox = document.createElement(`div`);
		motivationBox.innerHTML = prob.mistake;
		probDiv.append(motivationBox);
		solutionDiv.innerHTML = prob.solution;
		motivationBox.classList.add(`motivation-box`);
	});
}

function writeYoutubeVid(id) {
	let youtubeHtmlEmbed = `<iframe
			width='100%'
			height='100%'
			src='https://www.youtube.com/embed/${id}'
			title='YouTube video player'
			frameborder='0'
			allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
			allowfullscreen></iframe>`;

	document.querySelector('.intro-vid').innerHTML = youtubeHtmlEmbed;
}

function createWelcomeMessage(msg) {
	let welcomeDiv = document.querySelector('#welcome');
	welcomeDiv.innerHTML = msg;
}

function openSocial(social) {
	switch (social) {
		case 0:
			window.open(youtube, '_blank');
			break;
		case 1:
			window.open(facebook, '_blank');
			break;
		case 2:
			window.open(instagram, '_blank');
			break;
		default:
			alert(`Invalid Social`);
			break;
	}
}

function writeFAQHtml(QnA) {
	const outputArea = document.querySelector('#faq');
	for (let i = 1; i < QnA.length; i++) {
		const output = document.createElement('div');
		output.classList.add('faq');
		//write p tag for question
		const outputQ = document.createElement('p');
		outputQ.classList.add('small-text');
		outputQ.innerHTML = QnA[i].question;
		output.appendChild(outputQ);

		//write p tag for answer
		const outputA = document.createElement('p');
		outputA.classList.add('small-text');
		outputA.innerHTML = QnA[i].answer;
		output.appendChild(outputA);

		//console.log(outputQ.innerHTML);
		outputArea.appendChild(output);
	}
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
		const displayBlock = document.createElement('div');
		displayBlock.classList.add('top-testimony');

		//createing container for img
		const clientImageBlock = document.createElement('div');
		clientImageBlock.classList.add('testimony-pic-container');

		//creating image tag
		const img = document.createElement('img');
		img.classList.add(`client-pic`);
		img.src = `${clients[i].image}`;
		//console.log(clients[i].image);
		img.alt = 'Client Transformation Picture';

		//create quoteArea
		const quoteArea = document.createElement('div');
		quoteArea.classList.add('testimony-text');
		quoteArea.innerHTML = clients[i].decription + ' <br>' + clients[i].fullName;

		if (mobile) {
			clientImageBlock.style.width = `90%`;
			quoteArea.style.width = `90%`;
			displayBlock.style.flexDirection = `column`;
		}

		//adding img to img container
		clientImageBlock.appendChild(img);

		//adding everything to main container
		displayBlock.appendChild(clientImageBlock);
		displayBlock.appendChild(quoteArea);
		output.appendChild(displayBlock);
	}

	document.querySelector('#top-amount').innerHTML = clients.length;
}

function createNormalClient(clients) {
	const outputArea = document.querySelector('.more-trans');
	let count = 0;
	let threeClientBox;
	for (let i = 0; i < clients.length; i++) {
		let clientBox = document.createElement('div');
		clientBox.classList.add('clientbox');
		if (count % 3 == 0) {
			//Create big box holding 3 client
			threeClientBox = document.createElement('div');
			threeClientBox.classList.add('allclient-box');
			if (mobile) {
				threeClientBox.style.flexDirection = `column`;
			}
		}
		count++;

		//holds the iamge container
		let clientImageBox = document.createElement('div');
		clientImageBox.classList.add('clientbox-container');

		//box holding image
		let imageBox = document.createElement('div');
		imageBox.classList.add('clientbox-component');

		//image element
		let img = document.createElement('img');
		img.src = `${clients[i].image}`;
		img.alt = 'Client before annd after';
		img.style.width = '100%';
		img.style.height = '100%';

		//create quote container
		let quoteContainer = document.createElement('div');
		quoteContainer.classList.add('clientbox-container');

		//quote area
		let quoteArea = document.createElement('div');
		quoteArea.classList.add('clientbox-component');
		quoteArea.innerHTML = clients[i].decription + ' <br>' + clients[i].fullName;

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
		if (mobile) {
			clientBox.style.width = `100%`;
		}
		if (count == 3 || i == clients.length - 1) {
			outputArea.appendChild(threeClientBox);
		}
	}
}

scrollTopBtn.addEventListener('click', (e) => {
	window.scrollBy(0, -e.pageY);
});

scrollBotBtn.addEventListener('click', (e) => {
	window.scrollBy(0, document.body.scrollHeight);
});

function load() {
	loadConfigs();
	loadClientData();
	loadFAQData();
}

load();
