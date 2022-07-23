
import { Database, database } from "./database.js";
import { Layout } from "./template.js";
import { object, binding } from "./reactive.js";
import { LoadNav } from "./nav.js";
import { Период } from "./период.js";
import { format } from "./client.js";
import "./paginator.js";

export class Задачи
{
	async view(parent)
	{
		await LoadNav();
		let layout = await new Layout().load("задачи.html");
		layout.template("#filters").fill(this).out(parent.find("header"));
		document.find("#status").value = "undone";
		layout.template("#commands").fill(this).out(parent.find("menu"));
		layout.template("#content").fill(this).out(parent.find("main"));
		layout.template("#footer").fill(this).out(parent.find("footer"));
		await binding(parent);
		await this.Заполнить();
	}

	async Заполнить(очистить = true)
	{
		let layout = await new Layout().load("задачи.html");
		let paginator = await database.find(object.id + ".Paginator");
		let период = await database.find(object.Период.id);
		let db = await new Database().begin();
		if (очистить)
			paginator.clear();
		let query = 
		{
			"from": "Задача",
			"where": { "Срок": [ период.Начало, период.Окончание ] },
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
		paginator.split(query);
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
			let оформление = "bg-dark text-white";
			if (record.Статус)
			{
				let статус = await db.find(record.Статус);
				оформление = статус.Оформление;
			}
			template.fill( { "class": оформление } );
			template.fill(record);
			template.out("#content");
			paginator.add();
		}
		await paginator.request(db);
	}
}
