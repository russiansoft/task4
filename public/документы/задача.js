
export class Задача
{
	async create()
	{
		this.Срок = (new Date).toISOString().slice(0, 10);
		let входящие = await database.find( { "from": "Статус",
		                                      "where": { "Наименование": "Входящие" } } );
		this.Статус = входящие.id;
		this.Дата = (new Date).toISOString().slice(0, 10);
	}

	async view(parent)
	{
		let layout = await new Layout().load("задача.html");
		let template = layout.template("#form");
		template.fill(this);
		template.out(parent);
		this.ЗаполнитьВложения();
	}

	async ЗаполнитьВложения()
	{
		let layout = await new Layout().load("задача.html");
		document.find("#attach").innerHTML = "";
		for (let id of await database.select( {
			"from": "owner",
			"where": { "owner": object.id } } ))
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
			layout.template("#line").fill(attributes).out("#attach");
		}
	}

	async Изображение()
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
	
			database.add(object.id, "Вложения", { "Файл": value } );
			await this.ЗаполнитьВложения();
		} );
	}
}

