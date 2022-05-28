
async function Записать()
{
	await dataset.commit();
	close();
}

onload = async function()
{
	await dataset.begin();

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
	element("#task").innerHTML = task.Тема;
}
