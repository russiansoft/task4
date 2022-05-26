
function Изображение()
{
	new FileDialog().show();
}
	
async function Записать()
{
	await dataset.commit();
	close();
}

function Работа()
{
	open("works.html?task=" + document.record);
}

async function ЗаполнитьВложения()
{
	let outer = document.querySelector("#attach");
	outer.innerHTML = "";
	let query = 
	{
		"from": "owner",
		"where": { "owner": document.record }
	};
	for (let id of await dataset.select(query))
	{
		let item = await dataset.find(id);
		let attributes = { };
		for (let element of item.Файл.split("|"))
		{
			if (!element)
				continue;
			let pair = element.split(":");
			attributes[pair[0]] = pair[1];
		}
		console.log(attributes.address);
		attributes.address = attributes.address.replaceAll("\\", "/");
		console.log(attributes.address);
		new Template("#file-template").fill(attributes).out(outer);
	}
}

async function ОткрытьФайл(name, type, address)
{
	let file = await hive.get(address);
	let a = document.createElement("a");
    a.download = name;
    a.href = "data:" + type + ";base64," + file.content;
    a.click();
}

onload = async function()
{
	// Транзакция
	window.dataset = new Dataset();
	await dataset.begin(localStorage["device"]);

	// Значения статуса
	let list = document.querySelector("#status");
	list.innerHTML = "";
	let empty = { "id": "", "Наименование": "<не выбран>" };
	new Template("#templatestatus").fill(empty).out(list);
	let query = { "select": [ "id", "Наименование" ], "from": "Статус" };
	let defaultStatus = "";
	for (let record of await dataset.select(query))
	{
		new Template("#templatestatus").fill(record).out(list);
		if (record.Наименование == "Входящие")
			defaultStatus = record.id;
	}

	// Значения проекта
	list = document.querySelector('#project');
	list.innerHTML = "";
	empty = { "id": "", "Наименование": "<не выбран>" };
	new Template("#project-template").fill(empty).out(list);
	query = { "select": [ "id", "Наименование" ], "from": "Договор" };
	for (let record of await dataset.select(query))
		new Template("#project-template").fill(record).out(list);

	// Постановщик
	list = document.querySelector('#Постановщик');
	list.innerHTML = "";
	empty = { "id": "", "Наименование": "<не выбран>" };
	new Template("#Постановщик-template").fill(empty).out(list);
	query = { "select": [ "id", "Наименование" ], "from": "Сотрудник" };
	for (let record of await dataset.select(query))
		new Template("#Постановщик-template").fill(record).out(list);

	// Обработка изменений полей ввода
	document.onchange = OnChange;

	let url = new URL(location);
	if (url.searchParams.has("id"))
	{
		let id = url.searchParams.get("id");
		document.record = await dataset.find(id);
	}
	else
	{
		document.record = await dataset.create("Задача",
		{
			"Срок": (new Date).toISOString().slice(0, 10),
			"Дата": (new Date).toISOString().slice(0, 10),
			"Статус": defaultStatus
		} );
	}
	DataOut(document.record);

	ЗаполнитьВложения();
}

