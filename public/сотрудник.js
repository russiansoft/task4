
async function Записать()
{
	await database.commit();
	close();
}

onload = async function()
{
	await database.begin();

	document.onchange = OnChange;

	let url = new URL(location);
	if (url.searchParams.has("id"))
	{
		let id = url.searchParams.get("id");
		document.record = await database.find(id);
		DataOut(document.record);
	}
}
