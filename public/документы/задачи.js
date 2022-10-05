
import { Database, database } from "./database.js";
import { model } from "./model.js";
import { binding } from "./reactive.js";
import { server } from "./server.js";
import { format } from "./client.js";
import "./pagination.js";

document.classes["tasks-class"] = class
{
	async Create()
	{
		let layout = await server.LoadHTML("задачи.html");
		layout.template("#filters").fill(this).Join(this);
		document.get("#status").value = "undone";
		layout.template("#commands").fill(this).Join(this);
		layout.template("#content").fill(this).Join(this);
		layout.template("#footer").fill(this).Join(this);
		await this.Заполнить();
	}

	async Заполнить(очистить = true)
	{
		let layout = await server.LoadHTML("задачи.html");
		let pagination = document.get(".pagination-class");
		let период = await database.find(this.id + ".Период");
		let db = await new Database().transaction();
		if (очистить)
			document.get("#content").innerHTML = "";
		let query = 
		{
			"from": "Задача",
			//"where": { "Срок": [ период.Начало, период.Окончание ] },
			"filter": { }
		};
		let status = document.get("#status").value;
		if (status)
		{
			if (status == "undone")
			{
				query.filter.Статус = [ ];
				let q = { "select": { "id": "id", "Наименование": "Наименование" },
				          "from": "Статус" }
				for (let статус of await db.select(q))
				{
					if (статус.Наименование != "Завершено" &&
						статус.Наименование != "Информация")
						query.filter.Статус.push(статус.id);
				}
			}
			else
				query.filter.Статус = status;
		}
		let project = document.get("#project").value;
		if (project)
			query.filter.Проект = project;
		pagination.split(query);
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
			template.Join("#content");
			pagination.add();
		}
		await pagination.Request(db);
	}

	async More()
	{
		await this.Заполнить(false);
	}
}
