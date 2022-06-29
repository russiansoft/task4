
let stopwatch = null;
function log(text)
{
	let now = new Date();
	let delta = 0;
	if (stopwatch)
		delta = now - stopwatch;
	//let time =  //.toISOString().slice(11).replace("Z", "");
	stopwatch = now;
	console.log(delta + "\t" + text);
}

let working = false;

async function Work()
{
	let id = new Date().getMilliseconds();
	log("<" + id + ">");
	await database.sleep(1000);
	log("</" + id + ">");
}

async function Тест()
{
	log("Начало");
	Work();
	log("Окончание");
}
