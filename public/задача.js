
async function Изображение()
{
	new FileDialog().show(async function(file)
	{
		let extension = "";
		let point = file.name.lastIndexOf(".");
		if (point != -1)
			extension = file.name.slice(point + 1);
		console.log(extension);
		
		let result = await hive.put(file.data, extension);
		let value = "name:" + file.name;
		if (file.type) 
			value += "|type:" + file.type;
		value += "|address:" + result.address + "|";
		console.log(value);

		database.add(document.record, "Вложения", { "Файл": value } );
		await ЗаполнитьВложения();
	} );
}
	
async function Записать()
{
	await database.commit();
	close();
}

function Работа()
{
	open("работы.html?задача=" + document.record);
}

async function ЗаполнитьВложения()
{
	element("#attach").innerHTML = "";
	let query = 
	{
		"from": "owner",
		"where": { "owner": document.record }
	};
	for (let id of await database.select(query))
	{
		let item = await database.find(id);
		let attributes = { };
		for (let element of item.Файл.split("|"))
		{
			if (!element)
				continue;
			let pair = element.split(":");
			attributes[pair[0]] = pair[1];
		}
		attributes.address = attributes.address.replace(/\\/g, "/");
		new Template("#file-template").fill(attributes).out("#attach");
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
	await database.begin();

	// Значения статуса
	element("#status").innerHTML = "";
	let empty = { "id": "", "Наименование": "<не выбран>" };
	new Template("#templatestatus").fill(empty).out("#status");
	let query = { "select": [ "id", "Наименование" ], "from": "Статус" };
	let defaultStatus = "";
	for (let record of await database.select(query))
	{
		new Template("#templatestatus").fill(record).out("#status");
		if (record.Наименование == "Входящие")
			defaultStatus = record.id;
	}

	// Значения проекта
	element("#project").innerHTML = "";
	empty = { "id": "", "Наименование": "<не выбран>" };
	new Template("#project-template").fill(empty).out("#project");
	query = { "select": [ "id", "Наименование" ], "from": "Договор" };
	for (let record of await database.select(query))
		new Template("#project-template").fill(record).out("#project");

	// Постановщик
	element("#employee").innerHTML = "";
	empty = { "id": "", "Наименование": "<не выбран>" };
	new Template("#employee-template").fill(empty).out("#employee");
	query = { "select": [ "id", "Наименование" ], "from": "Сотрудник" };
	for (let record of await database.select(query))
		new Template("#employee-template").fill(record).out("#employee");

	// Обработка изменений полей ввода
	document.onchange = OnChange;

	let url = new URL(location);
	if (url.searchParams.has("id"))
	{
		let id = url.searchParams.get("id");
		document.record = await database.find(id);
	}
	else
	{
		document.record = await database.create("Задача",
		{
			"Срок": (new Date).toISOString().slice(0, 10),
			"Дата": (new Date).toISOString().slice(0, 10),
			"Статус": defaultStatus
		} );
	}
	DataOut(document.record);

	ЗаполнитьВложения();
}
