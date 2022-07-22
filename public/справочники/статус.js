
import { LoadNav } from "./nav.js";

export class Статусы
{
	async create()
	{
		await LoadNav();
	}

	async view(parent)
	{
		let layout = await new Layout().load("shared.html");
		await layout.template("#list").fill(this).out(parent);
		await binding(parent);
		this.Заполнить();
	}

	async Заполнить(очистить = true)
	{
		let layout = await new Layout().load("shared.html");
		let paginator = await database.find(object.id + ".Paginator");
		if (очистить)
			paginator.clear();
		let query = { "from": "Статус" };
		paginator.split(query);
		let records = await database.select(query);
		for (let id of records)
		{
			let record = await database.find(id);
			layout.template("#card").fill( { "type": "Статус" } ).
			                         fill(record).out("#content");
			paginator.add();
		}
		await paginator.request(database);
	}
}

export class Статус
{
	async view(parent)
	{
		let layout = await new Layout().load("статус.html");
		layout.template("#form").fill(this).out(parent);
	}
}
