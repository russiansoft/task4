
async function Upload()
{
	new FileDialog().show(async function(file)
	{
		let extension = "";
		let point = file.name.lastIndexOf(".");
		if (point != -1)
			extension = file.name.slice(point + 1);
		console.log(extension);
		
		let result = await hive.put(file.data, extension);
		let value = "name:" + file.name;
		if (file.type) 
			value += "|type:" + file.type;
		value += "|address:" + result.address + "|";
		console.log(value);
	} );
}

async function load()
{
	let type = "Задачи";
	let url = new URL(location);
	if (url.searchParams.has("type"))
		type = url.searchParams.get("type");
	document.title = type;
	let id = "";
	if (url.searchParams.has("id"))
		id = url.searchParams.get("id");
	await preload(type, id, "main");
	display("main", true);
}
