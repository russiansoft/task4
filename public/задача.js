
async function Изображение()
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

		database.add(document.record, "Вложения", { "Файл": value } );
		await ЗаполнитьВложения();
	} );
}

async function ЗаполнитьВложения()
{
	element("#attach").innerHTML = "";
	for (let id of await database.select( {
		"from": "owner",
		"where": { "owner": document.body.dataset.source } } ))
	{
		let item = await database.find(id);
		let attributes = { };
		for (let element of item.Файл.split("|"))
		{
			if (!element)
				continue;
			let pair = element.split(":");
			attributes[pair[0]] = pair[1];
		}
		attributes.address = attributes.address.replace(/\\/g, "/");
		new Template("#file-template").fill(attributes).out("#attach");
	}
}

async function ОткрытьФайл(name, type, address)
{
	let file = await hive.get(address);
	let a = document.createElement("a");
    a.download = name;
    a.href = "data:" + type + ";base64," + file.content;
    a.click();
}

async function Загрузка()
{
	ЗаполнитьВложения();
}
