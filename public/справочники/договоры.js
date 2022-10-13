
import { Database, database, server, review } from "./manuscript.js";

document.classes["договоры"] = class
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
		let query = { "from": "Договор" };
		pagination.split(query);
		let records = await database.select(query);
		for (let id of records)
		{
			let record = await database.find(id);
			await html.template("#card").
			           fill( { "type": "договор" } ).
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
