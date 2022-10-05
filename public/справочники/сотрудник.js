
import { model } from "./model.js";
import { Database, database } from "./database.js";
import { Layout } from "./template.js";
import { binding } from "./reactive.js";

model.classes.Сотрудники = class Сотрудники
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
		let paginator = await database.find(this.id + ".Paginator");
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

	async more()
	{
		await this.Заполнить(false);
	}
};

model.classes.Сотрудник = class Сотрудник
{
	async view(parent)
	{
		let layout = await new Layout().load("сотрудник.html");
		layout.template("#form").fill(this).out(parent);
	}
}
