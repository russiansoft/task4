
import { LoadNav } from "./nav.js";

let count = 0;

export class Статусы
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
		if (очистить)
		{
			element("#content").innerHTML = "";
			count = 0;
		}
		let query = 
		{
			"from": "Статус",
			"skip": count,
			"take": 15
		};
		let records = await database.select(query);
		for (let id of records)
		{
			let record = await database.find(id);
			layout.template("#card").fill( { "type": "Статус" } ).
			                         fill(record).out("#content");
		}
		count += records.length;
		query.skip += 14;
		query.take = 1;
		records = await database.select(query);
		display("#more", records.length > 0);
	}
}

export class Статус
{
	async view(parent)
	{
		let layout = await new Layout().load("shared.html");
		layout.template("#form").fill(this).out(parent);
	}
}
