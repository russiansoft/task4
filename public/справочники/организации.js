
import { Database, database, server, review } from "./manuscript.js";

document.classes["организации"] = class
{
	async Create()
	{
		await database.Begin();
		let html = await server.LoadHTML("справочники.html");
		await html.template("#list").Join(this);
		await this.Заполнить();
	}

	async Заполнить(очистить = true)
	{
		let html = await server.LoadHTML("справочники.html");
		let pagination = document.get(".pagination-class");
		if (очистить)
		{
			document.get("#content").innerHTML = "";
			pagination.reset();
		}
		let query = { "from": "Организация" };
		let search = document.get("#search").value;
		if (search)
			query.search = search;
		pagination.split(query);
		let records = await database.select(query);
		for (let id of records)
		{
			let record = await database.find(id);
			await html.template("#card").
			           fill( { "type": "организация" } ).
			           fill(record).
					   Join("#content");
			pagination.add();
		}
		await pagination.Request(database);
	}

	async More()
	{
		await this.Заполнить(false);
	}
}
