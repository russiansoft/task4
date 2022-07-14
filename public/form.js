
async function form()
{
	let url = new URL(location);
	if (url.searchParams.has("type"))
	{
		let type = url.searchParams.get("type");
		document.title = type;
		await load(type);
	}
}
