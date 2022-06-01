
let count = 0;
let статусы = { };

async function Заполнить()
{
	element("#content").innerHTML = "";
	count = 0;
	await Дозаполнить();
}

async function Дозаполнить()
{
	await dataset.begin();

	let from = element("#from").valueAsDate.toISOString().slice(0, 10);
	let to = element("#to").valueAsDate.toISOString().slice(0, 10);
	let query = 
	{
		"from": "Задача",
		"skip": count,
		"take": 20,
		"where": { "Срок": [ from, to ] },
		"filter":
		{
		}
	};
	let status = element("#status").value;
	if (status)
		query.filter.Статус = status;
	let project = element("#project").value;
	if (project)
		query.filter.Проект = project;
	let records = await dataset.select(query);
	for (let id of records)
	{
		let record = await dataset.find(id);
		let template = new Template("#card");
		if (record.Постановщик)
		{
			let постановщик = await dataset.find(record.Постановщик);
			template.fill( { "НаименованиеПостановщика": постановщик.Наименование } );
		}
		template.fill( { "Срок": format(record.Срок, "date") } );
		template.fill( { "Дата": format(record.Дата, "date") } );
		if (record.Статус == статусы["Входящие"])
			template.fill( { "class": "bg-warning text-dark" } );
		else if (record.Статус == статусы["Действия"])
			template.fill( { "class": "bg-danger text-white" } );
		else if (record.Статус == статусы["Завершено"])
			template.fill( { "class": "bg-success text-white" } );
		else if (record.Статус == статусы["Информация"])
			template.fill( { "class": "bg-info text-white" } );
		else if (record.Статус == статусы["Когда-нибудь, может быть"])
			template.fill( { "class": "" } );
		else if (record.Статус == статусы["Ожидания и отложено"])
			template.fill( { "class": "bg-secondary text-white" } );
		else
			template.fill( { "class": "bg-dark text-white" } );
		template.fill(record);
		template.out("#content");
	}
	count += records.length;
	query.skip += 20;
	query.take = 1;
	records = await dataset.select(query);
	display("#more", records.length > 0);
}

function Создать()
{
	open("задача.html");
}

function Открыть(id)
{
	open("задача.html?id=" + id);
}

onload = async function()
{
	await dataset.begin();

	(await new Template().load("menu.html")).out("nav");
	console.log("h:" + element("nav").offsetHeight);
	element("header").style.marginTop = element("nav").offsetHeight + "px";
	
	// Значения по умолчанию
	let today = new Date();
	let day = today.getDay() - 1;
	if (day < 0)
		day += 7;
	let from = today.getDate() - day;
	let to = from + 6;
	element("#from").valueAsDate = new Date(new Date().setDate(from));
	element("#to").valueAsDate = new Date(new Date().setDate(to));

	// Значения статуса
	element("#status").innerHTML = "";
	let empty = { "id": "", "Наименование": "<не выбран>" };
	new Template("#templatestatus").fill(empty).out("#status");
	let records = await dataset.select( { "from": "Статус" } );
	for (let id of records)
	{
		let record = await dataset.find(id);
		new Template("#templatestatus").fill(record).out("#status");
		статусы[record.Наименование] = record.id;
	}

	// Значения проекта
	element("#project").innerHTML = "";
	empty = { "id": "", "Наименование": "<не выбран>" };
	new Template("#project-template").fill(empty).out("#project");
	query = { "select": [ "id", "Наименование" ], "from": "Договор" };
	for (let record of await dataset.select(query))
		new Template("#project-template").fill(record).out("#project");

	Заполнить(true);
}
