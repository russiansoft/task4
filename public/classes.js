
import { Период } from "./период.js";
import { Задача, Задачи } from "./задача.js";

class Работа
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

class Сотрудник
{
}

class Договор
{
}

class Статус
{
}

class Вложение
{
}

window.classes =
{
	"Период": Период,
	"Задача": Задача,
	"Задачи": Задачи,
	"Работа": Работа,
	"Сотрудник": Сотрудник,
	"Договор": Договор,
	"Статус": Статус,
	"Вложение": Вложение
};
