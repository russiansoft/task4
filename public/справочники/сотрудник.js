
import { Database, database } from "./database.js";
import { Layout } from "./template.js";
import { object, binding } from "./reactive.js";
import { LoadNav } from "./nav.js";

export class Сотрудники
{
	async create()
	{
		await LoadNav();
	}
	
	async view(parent)
	{
		let layout = await new Layout().load("сотрудник.html");
		await layout.template("#list").fill(this).out(parent);
		await binding(parent);
		this.Заполнить();
		document.find("#search").focus();
	}

	async Заполнить(очистить = true)
	{
		let layout = await new Layout().load("сотрудник.html");
		let paginator = await database.find(object.id + ".Paginator");
		if (очистить)
			paginator.clear();
		let query = { "from": "Сотрудник" };
		paginator.split(query);
		let search = document.find("#search").value;
		if (search)
			query.search = search;
		let records = await database.select(query);
		for (let id of records)
		{
			let record = await database.find(id);
			layout.template("#card").fill(record).out("#content");
			paginator.add();
		}
		await paginator.request(database);
	}
}

export class Сотрудник
{
	async view(parent)
	{
		let layout = await new Layout().load("сотрудник.html");
		layout.template("#form").fill(this).out(parent);
	}
}
