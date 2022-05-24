
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
	for (let record of await dataset.select(query))
		new Template("#templatestatus").fill(record).out(list);

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
		document.record = await dataset.create("Задача");
		await dataset.save( [ { "id": document.record.id,
	                            "Срок": format(new Date, "value") } ] );
	}
	DataOut(document.record);
}

