
import { LoadNav } from "./nav.js";
import { Период } from "./период.js";

let period = null;
let count = 0;
let статусы = { };

export class Задачи
{
	async view(parent)
	{
		let layout = await new Layout().load("задача.html");

		await LoadNav();

		period = await database.create("Период");
		period.view(parent.find("header"));
		parent.find("header").addEventListener("save", function()
		{
			object.Заполнить();
		} );
	
		layout.template("#filters").fill(this).out(parent.find("header"));

		// Статусы
		let db = await new Database().begin();
		for (let id of await db.select( { "from": "Статус" } ))
			статусы[(await db.find(id)).Наименование] = id;
		document.find("#status").value = "undone";

		layout.template("#commands").fill(this).out(parent.find("menu"));
		
		layout.template("#content").fill(this).out(parent.find("main"));
		layout.template("#footer").fill(this).out(parent.find("footer"));

		await this.Заполнить();
	}

	async Заполнить(очистить = true)
	{
		let layout = await new Layout().load("задача.html");
		if (очистить)
		{
			document.find("#content").innerHTML = "";
			count = 0;
		}
		let db = await new Database().begin();
		let query = 
		{
			"from": "Задача",
			"skip": count,
			"take": 20,
			"where": { "Срок": [ period.Начало, period.Окончание ] },
			"filter": { }
		};
		let status = document.find("#status").value;
		if (status)
		{
			if (status == "undone")
			{
				query.filter.Статус = [ ];
				for (let статус of await db.select( { "select": [ "id", "Наименование" ],
													  "from": "Статус" } ))
				{
					if (статус.Наименование != "Завершено" &&
						статус.Наименование != "Информация")
						query.filter.Статус.push(статус.id);
				}
			}
			else
				query.filter.Статус = status;
		}
		let project = document.find("#project").value;
		if (project)
			query.filter.Проект = project;
		let records = await db.select(query);
		for (let id of records)
		{
			let record = await db.find(id);
			let template = layout.template("#card");
			if (record.Постановщик)
			{
				let постановщик = await db.find(record.Постановщик);
				template.fill( { "НаименованиеПостановщика": постановщик.Наименование } );
			}
			if (record.Проект)
			{
				let проект = await db.find(record.Проект);
				template.fill( { "НаименованиеПроекта": проект.Наименование } );
			}
			template.fill( { "Срок": format(record.Срок, "date") } );
			template.fill( { "Дата": format(record.Дата, "date") } );
			if (record.Статус == статусы["Входящие"])
				template.fill( { "class": "bg-warning text-dark" } );
			else if (record.Статус == статусы["Действия"])
				template.fill( { "class": "bg-danger text-white" } );
			else if (record.Статус == статусы["Завершено"])
				template.fill( { "class": "bg-success text-white" } );
			else if (record.Статус == статусы["Информация"])
				template.fill( { "class": "bg-info text-white" } );
			else if (record.Статус == статусы["Когда-нибудь, может быть"])
				template.fill( { "class": "" } );
			else if (record.Статус == статусы["Ожидания и отложено"])
				template.fill( { "class": "bg-info text-dark" } );
			else
				template.fill( { "class": "bg-dark text-white" } );
			template.fill(record);
			template.out("#content");
		}
		count += records.length;
		query.skip += 20;
		query.take = 1;
		records = await db.select(query);
		display("#more", records.length > 0);
	}

}

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
	
	async ОткрытьФайл(name, type, address)
	{
		let file = await hive.get(address);
		let a = document.createElement("a");
		a.download = name;
		a.href = "data:" + type + ";base64," + file.content;
		a.click();
	}
}

