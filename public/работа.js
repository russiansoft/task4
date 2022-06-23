
async function Записать()
{
	await database.commit();
	close();
}

onload = async function()
{
	await database.begin();

	let url = new URL(location);
	if (url.searchParams.has("id"))
	{
		let id = url.searchParams.get("id");
		document.record = await database.find(id);
	}
	else
	{
		let task = await database.find(url.searchParams.get("task"));
		document.record = await database.create("Работа",
		{
			"Дата": (new Date).toISOString().slice(0, 10),
			"Задача": task.id
		} );
	}
	let work = document.record;
	DataOut(document.record);
	let task = await database.find(work.Задача);
	element("#task").innerHTML = task.Тема;
}
