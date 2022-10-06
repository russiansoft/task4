
import { auth, hive, FileDialog, database, review } from "./manuscript.js";

document.classes["form-class"] = class
{
	async Create()
	{
		// Аутентификация
		await auth.load();

		// Начало транзакции
		await database.transaction();

		// Получение идентификатора
		let url = new URL(location);
		this.dataset.id = url.searchParams.get("id");

		// Получение экземпляра объекта
		let object = await database.find(this.dataset.id);

		await document.template("template#form").fill(object).Join(this);
		await review(this);

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

	async Изображение()
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
	
			database.add(self.id, "Вложения", { "Файл": value } );
			await self.ЗаполнитьВложения();
		} );
	}
}

document.classes["image-class"] = class
{
	async ОткрытьИзображение()
	{
		let attributes = this.attributes;
		new FileDialog().download(attributes.name, attributes.type, attributes.address);
	}
};
