
var Задача = class
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

		element("#attach").innerHTML = "";
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
			//await ЗаполнитьВложения();
		} );
	}
	
	async ОткрытьФайл(name, type, address)
	{
		let file = await hive.get(address);
		let a = document.createElement("a");
		a.download = name;
		a.href = "data:" + type + ";base64," + file.content;
		a.click();
	}
}

var Работа = class 
{
	async create()
	{
		this.Дата = (new Date).toISOString().slice(0, 10);

		let url = new URL(location);
		let task = await database.find(url.searchParams.get("task"));
		this.Задача = task.id;
	}

	async read()
	{
		if (this.Задача)
		{
			let task = await database.find(this.Задача);
			this.НаименованиеЗадачи = task.Тема;
		}
	}
}

var Задачи = class
{
	async create()
	{
	}
	async read()
	{
	}
}

var Сотрудник = class
{
}

var Договор = class
{
}

var Статус = class
{
}

var Вложение = class
{
}
