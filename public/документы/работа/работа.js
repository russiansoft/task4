
import { hive, FileDialog, database, review } from "./manuscript.js";

document.classes["form-class"] = class
{
	async Create()
	{
		let url = new URL(location);
		document.body.dataset.task = url.searchParams.get("task");
		let task = await database.find(document.body.dataset.task);
		let template = document.template("#form");
		template.fill(this);
		template.fill( { "НаименованиеЗадачи": task.Тема } );
		await template.Join(this);
		await review(this);
	}

	async Defaults()
	{
		return { "Дата": (new Date).toISOString().slice(0, 10),
		         "Задача": document.body.dataset.task };
	}
}
