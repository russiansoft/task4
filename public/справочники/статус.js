
import { Database, database, server, review } from "./manuscript.js";

document.classes["статус"] = class
{
	async Create()
	{
		await database.Begin();
		if (!this.dataset.id)
			this.dataset.id = (await database.create("Статус")).id;
		let html = await server.LoadHTML("статус.html");
		await html.template("#form").fill(this).Join(this);
		await review(this);
	}

	async Записать()
	{
		await database.commit();
		close();
	}

	async Закрыть()
	{
		close();
	}
}
