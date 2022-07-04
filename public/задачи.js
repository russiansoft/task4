
let count = 0;
let статусы = { };

async function Заполнить(очистить = true)
{
	if (очистить)
	{
		element("#content").innerHTML = "";
		count = 0;
	}

	let db = await new Database().begin();
	let query = 
	{
		"from": "Задача",
		"skip": count,
		"take": 20,
		"where": { "Срок": [ element("manuscript-period").fromDate,
		                     element("manuscript-period").toDate ] },
		"filter": { }
	};
	let status = element("#status").value;
	if (status)
	{
		if (status == "undone")
		{
			query.filter.Статус = [ ];
			for (let статус of await db.select( { "select": [ "id", "Наименование" ],
			                                      "from": "Статус" } ))
			{
				if (статус.Наименование != "Завершено" &&
				    статус.Наименование != "Информация")
					query.filter.Статус.push(статус.id);
			}
		}
		else
			query.filter.Статус = status;
	}
	let project = element("#project").value;
	if (project)
		query.filter.Проект = project;
	let records = await db.select(query);
	for (let id of records)
	{
		let record = await db.find(id);
		// if (status == "undone" && record.Статус == статусы["Завершено"])
		// 	continue;
		let template = new Template("#card");
		if (record.Постановщик)
		{
			let постановщик = await db.find(record.Постановщик);
			template.fill( { "НаименованиеПостановщика": постановщик.Наименование } );
		}
		if (record.Проект)
		{
			let проект = await db.find(record.Проект);
			template.fill( { "НаименованиеПроекта": проект.Наименование } );
		}
		template.fill( { "Срок": format(record.Срок, "date") } );
		template.fill( { "Дата": format(record.Дата, "date") } );
		if (record.Статус == статусы["Входящие"])
			template.fill( { "class": "bg-warning text-dark" } );
		else if (record.Статус == статусы["Действия"])
			template.fill( { "class": "bg-danger text-white" } );
		else if (record.Статус == статусы["Завершено"])
			template.fill( { "class": "bg-success text-white" } );
		else if (record.Статус == статусы["Информация"])
			template.fill( { "class": "bg-info text-white" } );
		else if (record.Статус == статусы["Когда-нибудь, может быть"])
			template.fill( { "class": "" } );
		else if (record.Статус == статусы["Ожидания и отложено"])
			template.fill( { "class": "bg-info text-dark" } );
		else
			template.fill( { "class": "bg-dark text-white" } );
		template.fill(record);
		template.out("#content");
	}
	count += records.length;
	query.skip += 20;
	query.take = 1;
	records = await db.select(query);
	display("#more", records.length > 0);
}

async function Загрузка()
{
	await LoadNav();
	review(document);
	
	// Статусы
	let db = await new Database().begin();
	for (let id of await db.select( { "from": "Статус" } ))
		статусы[(await db.find(id)).Наименование] = id;
	element("#status").value = "undone";

	Заполнить();
}
