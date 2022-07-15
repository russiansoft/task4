import { LoadNav } from "./nav.js";

let count = 0;

export class Сотрудники
{
	async create()
	{
		await LoadNav();
	}
	async view(parent)
	{
		let layout = await new Layout().load("сотрудник.html");
		layout.template("#list").out(parent);
		this.Заполнить();
		element("#search").focus();
	}

	async Заполнить(очистить = true)
	{
		let layout = await new Layout().load("сотрудник.html");
		if (очистить)
		{
			element("#content").innerHTML = "";
			count = 0;
		}
		let query = 
		{
			"from": "Сотрудник",
			"skip": count,
			"take": 15
		};
		let search = element("#search").value;
		if (search)
			query.search = search;
		let records = await database.select(query);
		for (let id of records)
		{
			let record = await database.find(id);
			layout.template("#card").fill(record).out("#content");
		}
		count += records.length;
		query.skip += 14;
		query.take = 1;
		records = await database.select(query);
		display("#more", records.length > 0);
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
