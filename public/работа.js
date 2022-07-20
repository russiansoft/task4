
import { LoadNav } from "./nav.js";
import { Период } from "./период.js";

let task = null;
//let period = null;
let count = 0;

export class Работы
{
	async create()
	{
		await LoadNav();
	}

	async view(parent)
	{
		let layout = await new Layout().load("работа.html");
		layout.template("#title").fill(this).out(parent);

		// period = await database.create("Период");
		// period.view(parent);
	
		// layout.template("#filters").fill(this).out(parent);

		// // Статусы
		// let db = await new Database().begin();
		// for (let id of await db.select( { "from": "Статус" } ))
		// 	статусы[(await db.find(id)).Наименование] = id;
		// document.find("#status").value = "undone";

		layout.template("#commands").fill(this).out(parent);

		// Отбор по задаче
		let url = new URL(location);
		if (url.searchParams.has("задача"))
		{
			task = url.searchParams.get("задача");
			let record = await database.find(task);
			document.find("#task").innerHTML = record.Тема;
			document.find("#create").href = "?type=Работа&task=" + task;
		}
		
		layout.template("template#content").fill(this).out(parent);

		this.Заполнить();

		layout.template("#footer").fill(this).out(parent);
	}

	async Заполнить(очистить = true)
	{
		let layout = await new Layout().load("работа.html");
		if (очистить)
		{
			document.find("#content").innerHTML = "";
			count = 0;
		}
	
		let период = await database.find(object.Период.id);
		let db = await new Database().begin();
		let query = 
		{
			"from": "Работа",
			"skip": count,
			"take": 15,
			"where": { "Дата": [ период.Начало, период.Окончание ] }
		};
		if (task)
			query.filter = { "Задача": task };
		let records = await db.select(query);
		for (let id of records)
		{
			let record = await db.find(id);
			let template = layout.template("#card");
			template.fill( { "Дата": format(record.Дата, "date") } );
			template.fill( { "Начало": format(record.Начало, "time") } );
			template.fill( { "Окончание": format(record.Окончание, "time") } );
			template.fill(record);
			template.out("#content");
		}
		count += records.length;
		query.skip += 14;
		query.take = 1;
		records = await db.select(query);
		display("#more", records.length > 0);
	}
}

export class Работа
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

	async view(parent)
	{
		let layout = await new Layout().load("работа.html");
		let template = layout.template("#form");
		template.fill(this);
		template.out(parent);
	}
}
