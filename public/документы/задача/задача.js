
import { server, hive, FileDialog, database, review } from "./manuscript.js";

	// <body data-purpose="edit" data-type="Задача"
	//       data-defaults="form-class">

document.classes["задача"] = class
{
	async Create()
	{
		await database.Begin();
		if (!this.dataset.id)
		{
			let входящие = await database.find( {
				"from": "Статус",
				"where": { "Наименование": "Входящие" } } );
			let defaults = { "Срок": (new Date).toISOString().slice(0, 10),
					         "Статус": входящие.id,
					         "Дата": (new Date).toISOString().slice(0, 10) };
			this.dataset.id = (await database.create("Задача", defaults)).id;
		}
		let object = await database.find(this.dataset.id);
		let templates = await server.LoadHTML("задача.html");
		await templates.template("#form").fill(object).Join(this);
		await review(this);
		this.ЗаполнитьВложения();
	}

	async ЗаполнитьВложения()
	{
		let templates = await server.LoadHTML("задача.html");
		document.get("#attach").innerHTML = "";
		let query = { "from": "owner",
			          "where": { "owner": document.body.dataset.id },
					  "filter": { "deleted": "" } }
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
			templates.template("#line").fill(item).fill(item.attributes).Join("#attach");
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
	
			database.add(document.body.dataset.id, "Вложения", { "Файл": value } );
			await self.ЗаполнитьВложения();
		} );
	}

	async ОчиститьИзображения()
	{
		let changes = [ ];
		let query = { "from": "owner",
			          "where": { "owner": document.body.dataset.id } };
		for (let id of await database.select(query))
			changes.push( { "id": id, "deleted": "1" } );
		await database.save(changes);
		await this.ЗаполнитьВложения();
	}	
}

document.classes["image-class"] = class
{
	async ОткрытьИзображение()
	{
		new FileDialog().download(this.dataset.name, this.dataset.type, this.dataset.address);
	}
};
