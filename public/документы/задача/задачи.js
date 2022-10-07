
import { Database, database, review, server, format } from "./manuscript.js";

document.classes["tasks-class"] = class
{
	async Create()
	{
		await database.Begin();
		let layout = await server.LoadHTML("задачи.html");
		await layout.template("#form").fill(this).Join(this);
		document.get("#status").value = "undone";
		await this.Заполнить();
		await review(this);
	}

	async Заполнить(очистить = true)
	{
		let layout = await server.LoadHTML("задачи.html");
		let pagination = document.get(".pagination-class");
		let period = document.get(".period-class");
		let db = await new Database().Begin();
		if (очистить)
		{
			document.get("#content").innerHTML = "";
			pagination.reset();
		}
		let query = 
		{
			"from": "Задача",
			"where": { "Срок": [ period.from.value, period.to.value ] },
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

	async ПредыдущийПериод()
	{
		await this.Заполнить();
	}

	async СледующийПериод()
	{
		await this.Заполнить();
	}

	async More()
	{
		await this.Заполнить(false);
	}
}
