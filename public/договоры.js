
let count = 0;

async function Заполнить(clear = false)
{
	await dataset.begin();

	let content = document.querySelector("#content");
	if (clear)
	{
		content.innerHTML = "";
		count = 0;
	}
	let query = 
	{
		"from": "Договор",
		"skip": count,
		"take": 15
	};
	let records = await dataset.select(query);
	for (let id of records)
	{
		let record = await dataset.find(id);
		new Template("#карточка").fill(record).out(content);
	}
	count += records.length;
	query.skip += 14;
	query.take = 1;
	records = await dataset.select(query);
	let have = records.length > 0;
	if (have)
		document.querySelector("#more").classList.remove("d-none");
	else
		document.querySelector("#more").classList.add("d-none");
}

function Открыть(id)
{
	console.log(id);
	let child = open("договор?id=" + id);
	if (child == null)
		throw("Ошибка открытия " + location);
	//else
		//child.sessionStorage["form"] = Id;
}

onload = async function()
{
	Заполнить(true);
}
