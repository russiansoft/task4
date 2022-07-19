import { LoadNav } from "./nav.js";
import { Период } from "./период.js";

let count = 0;

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
		await this.Заполнить();
	}

	async Заполнить(очистить = true)
	{
		let layout = await new Layout().load("задачи.html");
		if (очистить)
		{
			document.find("#content").innerHTML = "";
			count = 0;
		}
		let период = await database.find(object.Период.id);
		let db = await new Database().begin();
		let query = 
		{
			"from": "Задача",
			"skip": count,
			"take": 20,
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
		let records = await db.select(query);

		let статусы = { };
		for (let id of await db.select( { "from": "Статус" } ))
			статусы[(await db.find(id)).Наименование] = id;

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

			// Статусы
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
