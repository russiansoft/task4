
let count = 0;

async function Заполнить(clear = false)
{
	await database.begin();
	if (clear)
	{
		element("#content").innerHTML = "";
		count = 0;
	}
	let query = 
	{
		"from": "Договор",
		"skip": count,
		"take": 15
	};
	let records = await database.select(query);
	for (let id of records)
	{
		let record = await database.find(id);
		new Template("#card").fill(record).out("#content");
	}
	count += records.length;
	query.skip += 14;
	query.take = 1;
	records = await database.select(query);
	display("#more", records.length > 0);
}

function Открыть(id)
{
	open("договор?id=" + id);
}

onload = async function()
{
	Заполнить(true);
}
