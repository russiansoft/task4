
let task = null;
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
		let template = new Template("#карточка");
		template.fill( { "Начало": format(record.Начало, "time") } );
		template.fill( { "Окончание": format(record.Окончание, "time") } );
		template.fill(record);
		template.out(content);
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

// Открытие карточки
function Открыть(id)
{
	console.log(id);
	let child = open("work?id=" + id);
	if (child == null)
		throw("Ошибка открытия " + location);
	//else
		//child.sessionStorage["form"] = Id;
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

	let url = new URL(location);
	if (url.searchParams.has("task"))
		task = url.searchParams.get("task");

	Заполнить(true);
}


