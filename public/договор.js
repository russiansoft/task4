
import { LoadNav } from "./nav.js";

export class Договоры
{
	async create()
	{
		await LoadNav();
	}

	async view(parent)
	{
		let layout = await new Layout().load("shared.html");
		layout.template("#list").out(parent);
		this.Заполнить();
	}

	async Заполнить(очистить = true)
	{
		let layout = await new Layout().load("shared.html");
		let paginator = document.find("data-paginator");
		if (очистить)
			paginator.clear();
		let query = { "from": "Договор" };
		paginator.split(query);
		let records = await database.select(query);
		for (let id of records)
		{
			let record = await database.find(id);
			layout.template("#card").fill( { "type": "Договор" } ).
			                         fill(record).out("#content");
			paginator.add();
		}
		await paginator.request(database);
	}
}

export class Договор
{
	async view(parent)
	{
		let layout = await new Layout().load("shared.html");
		layout.template("#form").fill(this).out(parent);
	}
}
