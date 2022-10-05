
import { hive } from "./server.js";
import { FileDialog } from "./client.js";
import { model } from "./model.js";
import { Layout } from "./template.js";
import { Database, database } from "./database.js";
import { binding } from "./reactive.js";

model.classes.Задача = class Задача
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
			"where": { "owner": this.id } } ))
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
			layout.template("#line").fill(item).fill(item.attributes).out("#attach");
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

model.classes.Вложение = class Вложение
{
	async ОткрытьИзображение()
	{
		let attributes = this.attributes;
		new FileDialog().download(attributes.name, attributes.type, attributes.address);
	}
};
