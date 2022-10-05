
import { model } from "./model.js";
import { Database, database } from "./database.js";
import { Layout } from "./template.js";

model.classes.Договоры = class Договоры
{
	async create()
	{
		await LoadNav();
	}

	async view(parent)
	{
		let layout = await new Layout().load("справочники.html");
		await layout.template("#list").fill(this).out(parent);
		await binding(parent);
		this.Заполнить();
	}

	async Заполнить(очистить = true)
	{
		let layout = await new Layout().load("справочники.html");
		let paginator = database.get(this.id + ".Paginator");
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

	async more()
	{
		await this.Заполнить(false);
	}
};

model.classes.Договор = class Договор
{
	async view(parent)
	{
		let layout = await new Layout().load("справочники.html");
		layout.template("#form").fill(this).out(parent);
	}
};
