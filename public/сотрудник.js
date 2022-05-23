
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
		DataOut(document.record);
	}
}

