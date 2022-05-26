
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
		let task = await dataset.find(url.searchParams.get("task"));
		document.record = await dataset.create("Работа",
		{
			"Дата": (new Date).toISOString().slice(0, 10),
			"Задача": task.id
		} );
	}
	let work = document.record;
	DataOut(document.record);
	let task = await dataset.find(work.Задача);
	document.querySelector("#task").innerHTML = task.Тема;
}

