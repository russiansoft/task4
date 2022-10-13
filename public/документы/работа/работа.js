
import { server, hive, FileDialog, database, review } from "./manuscript.js";

document.classes["работа"] = class
{
	async Create()
	{
		await database.Begin();
		let task = await database.find(document.body.dataset.task);
		if (!this.dataset.id)
		{
			let defaults = { "Дата": (new Date).toISOString().slice(0, 10),
		                     "Задача": url.searchParams.get("task") };
			this.dataset.id = (await database.create("Работа", defaults)).id;
		}
		let templates = await server.LoadHTML("работа.html");
		let template =  templates.template("#form");
		template.fill(this);
		template.fill( { "НаименованиеЗадачи": task.Тема } );
		await template.Join(this);
		await review(this);
	}

	async Defaults()
	{
		let url = new URL(location);
	}
}
