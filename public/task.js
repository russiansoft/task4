
// Запись
async function Записать()
{
	await dataset.commit();
	close();
}

// При загрузке
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
	let records = await dataset.select( { "from": "Статус" } );
	for (let id of records)
	{
		let record = await dataset.find(id);
		new Template("#templatestatus").fill(record).out(list);
	}

	// Значения проекта
	list = document.querySelector('#project');
	list.innerHTML = "";
	empty = { "id": "", "Наименование": "<не выбран>" };
	new Template("#project-template").fill(empty).out(list);
	records = await dataset.select( { "from": "Договор" } );
	for (let id of records)
	{
		let record = await dataset.find(id);
		new Template("#project-template").fill(record).out(list);
	}

	// Постановщик
	list = document.querySelector('#Постановщик');
	list.innerHTML = "";
	empty = { "id": "", "Наименование": "<не выбран>" };
	new Template("#Постановщик-template").fill(empty).out(list);
	records = await dataset.select( { "from": "Сотрудник" } );
	for (let id of records)
	{
		let record = await dataset.find(id);
		new Template("#Постановщик-template").fill(record).out(list);
	}

	// Обработка изменений полей ввода
	document.onchange = OnChange;

	let url = new URL(location);
	if (url.searchParams.has("id"))
	{
		let id = url.searchParams.get("id");
		document.record = await dataset.find(id);
		DataOut(document.record);
	}
}

