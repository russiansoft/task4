
async function Записать()
{
	await dataset.commit();
	close();
}

onload = async function()
{
	await dataset.begin();

	document.onchange = OnChange;

	let url = new URL(location);
	if (url.searchParams.has("id"))
	{
		let id = url.searchParams.get("id");
		document.record = await dataset.find(id);
		DataOut(document.record);
	}
}
