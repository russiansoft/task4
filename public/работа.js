
import { LoadNav } from "./nav.js";
import { Период } from "./период.js";

let task = null;

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
	}

	async Заполнить(очистить = true)
	{
		let layout = await new Layout().load("работа.html");
		let paginator = document.find("data-paginator");
		let период = await database.find(object.Период.id);
		let db = await new Database().begin();
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
