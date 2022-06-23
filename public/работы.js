
let task = null;
let count = 0;

async function Заполнить()
{
	element("#content").innerHTML = "";
	count = 0;
	await Дозаполнить();
}

async function Дозаполнить()
{
	await database.begin();

	let from = element("#from").valueAsDate.toISOString().slice(0, 10);
	let to = element("#to").valueAsDate.toISOString().slice(0, 10);
	let query = 
	{
		"from": "Работа",
		"skip": count,
		"take": 15,
		"where": { "Дата": [ from, to ] }
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
	await database.begin();

	// Отбор по задаче
	let url = new URL(location);
	if (url.searchParams.has("задача"))
	{
		task = url.searchParams.get("задача");
		let record = await database.find(task);
		element("#task").innerHTML = record.Тема;
	}

	// Значения по умолчанию
	if (url.searchParams.has("задача"))
	{
		let year = new Date().getFullYear();
		element("#from").valueAsDate = new Date(year, 0, 1);
		element("#to").valueAsDate = new Date(year, 11, 31);
	}
	else
	{
		let today = new Date();
		let day = today.getDay() - 1;
		if (day < 0)
			day += 7;
		let from = today.getDate() - day;
		let to = from + 6;
		element("#from").valueAsDate = new Date(new Date().setDate(from));
		element("#to").valueAsDate = new Date(new Date().setDate(to));
	}

	Заполнить();
}


