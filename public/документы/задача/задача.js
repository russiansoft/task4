
import { auth, hive, FileDialog, database, review } from "./manuscript.js";

document.classes["form-class"] = class
{
	async Create()
	{
		// Аутентификация
		await auth.load();

		// Начало транзакции
		await database.transaction();

		// Получение объекта
		let object = null;
		let url = new URL(location);
		if (url.searchParams.has("id"))
		{
			this.dataset.id = url.searchParams.get("id");
			object = await database.find(this.dataset.id);
		}

		// Создание объекта
		else
		{
			let входящие = await database.find( { "from": "Статус",
												  "where": { "Наименование": "Входящие" } } );
			let defaults = { "Срок": (new Date).toISOString().slice(0, 10),
							 "Статус": входящие.id,
							 "Дата": (new Date).toISOString().slice(0, 10) };
			object = await database.create("Задача", defaults);
			this.dataset.id = object.id;
		}

		await document.template("template#form").fill(object).Join(this);
		await review(this);
		this.ЗаполнитьВложения();
	}

	async ЗаполнитьВложения()
	{
		document.get("#attach").innerHTML = "";
		let query = { "from": "owner",
			          "where": { "owner": this.dataset.id } }
		for (let id of await database.select(query))
		{
			let item = await database.find(id);
			item.attributes = { };
			for (let element of item.Файл.split("|"))
			{
				if (!element)
					continue;
				let pair = element.split(":");
				item.attributes[pair[0]] = pair[1];
			}
			item.attributes.address = item.attributes.address.replace(/\\/g, "/");
			document.template("#line").fill(item).fill(item.attributes).Join("#attach");
		}
	}

	async ДобавитьИзображение()
	{
		let self = this;
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
	
			database.add(self.dataset.id, "Вложения", { "Файл": value } );
			await self.ЗаполнитьВложения();
		} );
	}
}

document.classes["image-class"] = class
{
	async ОткрытьИзображение()
	{
		let record = database.find(this.id);
		new FileDialog().download(record.name, record.type, record.address);
	}
};
