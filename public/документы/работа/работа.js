
import { Database, database } from "./database.js";
import { Layout } from "./template.js";
import { model } from "./model.js";
import { binding } from "./reactive.js";
import { format } from "./client.js";

let task = null;

model.classes.Работы = class Работы
{
	async view(parent)
	{
		let layout = await new Layout().load("работа.html");
		layout.template("#title").fill(this).out(parent);
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
		await binding(parent);
		this.Заполнить();
	}

	async Заполнить(очистить = true)
	{
		let layout = await new Layout().load("работа.html");
		let paginator = await database.find(this.id + ".Paginator");
		let период = await database.find(this.id + ".Период");
		let db = await new Database().Begin();
		if (очистить)
			paginator.clear();
		let query = 
		{
			"from": "Работа",
			"where": { "Дата": [ период.Начало, период.Окончание ] }
		};
		if (task)
			query.filter = { "Задача": task };
		paginator.split(query);
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
			paginator.add();
		}
		await paginator.request(db);
	}

	async more()
	{
		await this.Заполнить(false);
	}
}

model.classes.Работа = class Работа
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
