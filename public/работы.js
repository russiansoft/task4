
let task = null;
let count = 0;

async function Заполнить(очистить = true)
{
	if (очистить)
	{
		element("#content").innerHTML = "";
		count = 0;
	}

	await database.begin();
	let query = 
	{
		"from": "Работа",
		"skip": count,
		"take": 15,
		"where": { "Дата": [ element("manuscript-period").fromDate,
		                     element("manuscript-period").toDate ] }
	};
	if (task)
		query.filter = { "Задача": task };
	let records = await database.select(query);
	for (let id of records)
	{
		let record = await database.find(id);
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
	records = await database.select(query);
	display("#more", records.length > 0);
}

onload = async function()
{
	await database.begin();

	// Отбор по задаче
	let url = new URL(location);
	if (url.searchParams.has("задача"))
	{
		task = url.searchParams.get("задача");
		let record = await database.find(task);
		element("#task").innerHTML = record.Тема;
		element("#create").href = "работа?task=" + task;
	}

	review(document);

	// Значения по умолчанию
	if (url.searchParams.has("задача"))
	{
		let year = new Date().getFullYear();
		//element("#from").valueAsDate = new Date(year, 0, 1);
		//element("#to").valueAsDate = new Date(year, 11, 31);
	}

	Заполнить();
}


