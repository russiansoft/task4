
let task = null;
let count = 0;

async function Заполнить(clear = false)
{
	await dataset.begin();

	if (clear)
	{
		element("#content").innerHTML = "";
		count = 0;
	}
	let query = 
	{
		"from": "Работа",
		"skip": count,
		"take": 15
	};
	if (task)
		query.filter = { "Задача": task };
	let records = await dataset.select(query);
	for (let id of records)
	{
		let record = await dataset.find(id);
		let template = new Template("#card");
		template.fill( { "Дата": format(record.Дата, "date") } );
		template.fill( { "Начало": format(record.Начало, "time") } );
		template.fill( { "Окончание": format(record.Окончание, "time") } );
		template.fill(record);
		template.out("#content");
	}
	count += records.length;
	query.skip += 14;
	query.take = 1;
	records = await dataset.select(query);
	display("#more", records.length > 0);
}

function Создать()
{
	open("работа.html?task=" + task);
}

function Открыть(id)
{
	open("работа?id=" + id);
}

onload = async function()
{
	await dataset.begin();

	// Отбор по задаче
	let url = new URL(location);
	if (url.searchParams.has("task"))
	{
		task = url.searchParams.get("task");
		let record = await dataset.find(task);
		element("#task").innerHTML = record.Тема;
	}

	Заполнить(true);
}


