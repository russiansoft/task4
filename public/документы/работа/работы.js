
import { server, Database, database, format } from "./manuscript.js";

document.classes["работы"] = class
{
	async Create()
	{
		// Получение задачи
		await database.Begin();
		if (!this.dataset.задача)
			throw "Отсутствует задача";
		let task = await database.find(this.dataset.задача);
		let templates = await server.LoadHTML("работы.html");
		await templates.template("#form").fill(task).Join(this);

		// Отбор по задаче
		// 	let record = await database.find(task);
		// 	document.find("#task").innerHTML = record.Тема;
		// 	document.find("#create").href = "?type=Работа&task=" + task;
		// }
		
		// layout.template("template#content").fill(this).out(parent);
		// await binding(parent);

		await this.Заполнить();
	}

	async Заполнить(очистить = true)
	{
		//console.log("Заполнить works-class");
		let templates = await server.LoadHTML("работы.html");
		let pagination = document.get(".pagination-class");
		let db = await new Database().Begin();
		if (очистить)
		{
			document.get("#content").innerHTML = "";
			pagination.reset();
		}
		let query = 
		{
			"from": "Работа"
			//, "where": { "Дата": [ период.Начало, период.Окончание ] }
		};
		//if (task)
			query.filter = { "Задача": this.dataset.задача };
		pagination.split(query);
		let records = await db.select(query);
		for (let id of records)
		{
			let record = await db.find(id);
			let template = templates.template("#card");
			template.fill( { "Дата": format(record.Дата, "date") } );
			template.fill( { "Начало": format(record.Начало, "time") } );
			template.fill( { "Окончание": format(record.Окончание, "time") } );
			template.fill(record);
			await template.Join("#content");
			pagination.add();
		}
		await pagination.Request(db);
	}

	async More()
	{
		await this.Заполнить(false);
	}
}
