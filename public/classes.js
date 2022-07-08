
var Задача = class
{
	async create()
	{
		this.Срок = (new Date).toISOString().slice(0, 10);
		let входящие = await database.find( { "from": "Статус",
		                                      "where": { "Наименование": "Входящие" } } );
		this.Статус = входящие.id;
		this.Дата = (new Date).toISOString().slice(0, 10);
	}
}

var Работа = class 
{
	async create()
	{
		this.Дата = (new Date).toISOString().slice(0, 10);

		let url = new URL(location);
		let task = await database.find(url.searchParams.get("task"));
		this.Задача = task.id;
	}

	async read()
	{
		if (this.Задача)
		{
			let task = await database.find(this.Задача);
			this.НаименованиеЗадачи = task.Тема;
		}
	}
}

var Задачи = class
{
	async create()
	{
	}
	async read()
	{
	}
}

var Сотрудник = class
{
}

var Договор = class
{
}

var Статус = class
{
}
