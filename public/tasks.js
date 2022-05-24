
let count = 0;

// Заполнение
async function Заполнить(clear = false)
{
	// Новая транзакция
	window.dataset = new Dataset();
	await dataset.begin(localStorage["device"]);

	let content = document.querySelector("#content");
	if (clear)
	{
		content.innerHTML = "";
		count = 0;
	}
	let from = format(document.querySelector("#from").valueAsDate, "value");
	let to = format(document.querySelector("#to").valueAsDate, "value");
	let query = 
	{
		"from": "Задача",
		"skip": count,
		"take": 5,
		"where": { "Срок": [ from, to ] },
		"filter":
		{
		}
	};
	let status = document.querySelector("#status").value;
	if (status)
		query.filter.Статус = status;
	let records = await dataset.select(query);
	for (let id of records)
	{
		let record = await dataset.find(id);
		let template = new Template("#карточка");
		if (record.Постановщик)
		{
			let постановщик = await dataset.find(record.Постановщик);
			template.fill( { "НаименованиеПостановщика": постановщик.Наименование } );
		}
		template.fill( { "Срок": format(record.Срок, "date") } );
		template.fill( { "Дата": format(record.Дата, "date") } );
		template.fill(record);
		template.out(content);
	}
	count += records.length;
	query.skip += 4;
	query.take = 1;
	records = await dataset.select(query);
	let have = records.length > 0;
	if (have)
		document.querySelector("#more").classList.remove("d-none");
	else
		document.querySelector("#more").classList.add("d-none");
}

// Открытие карточки
function Открыть(id)
{
	console.log(id);
	let child = open("task.html?id=" + id);
	if (child == null)
		throw("Ошибка открытия " + location);
	//else
		//child.sessionStorage["form"] = Id;
}

function Создать()
{
	open("task.html");
}

// Событие загрузки
onload = async function()
{
	// Идентификация устройства
	if (!localStorage["device"])
		localStorage["device"] = await app.guid();
	let device = localStorage["device"];
	console.log("Идентификатор устройства " + device);

	// Транзакция
	window.dataset = new Dataset();
	await dataset.begin(localStorage["device"]);

	// Обработка изменений полей ввода
	document.onchange = OnChange;

	// Значения по умолчанию
	let today = new Date();
	let from = today.getDate() - today.getDay() + 1;
	let to = from + 6;
	document.querySelector("#from").valueAsDate = new Date(today.setDate(from));
	document.querySelector("#to").valueAsDate = new Date(today.setDate(to));

	// Значения статуса
	let list = document.querySelector("#status");
	list.innerHTML = "";
	let empty = { "id": "", "Наименование": "<не выбран>" };
	new Template("#templatestatus").fill(empty).out(list);
	let records = await dataset.select( { "from": "Статус" } );
	for (let id of records)
	{
		let record = await dataset.find(id);
		new Template("#templatestatus").fill(record).out(list);
	}

	Заполнить(true);
}


