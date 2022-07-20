import { LoadNav } from "./nav.js";
import { Период } from "./период.js";

class DataPaginator extends HTMLElement
{
	constructor()
	{
		super();
		this.text = null;
		this.more = null;
		this.portion = 0;
		this.container = "";
		this.onmore = "";
		this.count = 0;
		this.query = null;
	}

	async connectedCallback()
	{
		this.portion = parseInt(this.getAttribute("portion"));
		if (!this.portion)
			throw "Отсутствует размер порции";
		this.container = this.getAttribute("container");
		if (!this.container)
		throw "Отсутствует контейнер";
		this.onmore = this.getAttribute("onmore");
		let layout = await new Layout().load("задачи.html");
		layout.template("#paginator").out(this);
		this.text = this.find("#data-paginator-text");
		this.more = this.find("#data-paginator-more");
		this.more.onclick = () =>
		{
			if (this.onmore)
				eval(this.onmore);
		}
	}

	// Очистка перед выводом
	clear()
	{
		document.find(this.container).innerHTML = "";
		this.count = 0;
	}

	// Вставка в запрос параметров разбивки по страницам
	split(query)
	{
		query.skip = this.count;
		query.take = this.portion;
		this.query = query;
	}

	// Добавление в общее количество выводимой записи
	add()
	{
		this.count++;
	}

	// Запрос остатка
	async request(db)
	{
		this.query.skip = this.count;
		this.query.take = 1;
		let records = await db.select(this.query);
		let information = "Выведено: " + this.count;
		let more = records.length > 0;
		if (more)
		{
			this.query.take = -1;
			records = await db.select(this.query); // !!!!!!!!!!!!
			let total = this.count + records.length;
			information += " из " + total;
		}
		this.text.innerHTML = information;
		display(this.more, more);
		return more;
	}
}
customElements.define("data-paginator", DataPaginator);

export class Задачи
{
	async view(parent)
	{
		await LoadNav();
		let layout = await new Layout().load("задачи.html");
		layout.template("#filters").fill(this).out(parent.find("header"));
		document.find("#status").value = "undone";
		layout.template("#commands").fill(this).out(parent.find("menu"));
		layout.template("#content").fill(this).out(parent.find("main"));
		layout.template("#footer").fill(this).out(parent.find("footer"));
		await this.Заполнить();
	}

	async Заполнить(очистить = true)
	{
		let layout = await new Layout().load("задачи.html");
		let paginator = document.find("data-paginator");
		let период = await database.find(object.Период.id);
		let db = await new Database().begin();
		if (очистить)
			paginator.clear();
		let query = 
		{
			"from": "Задача",
			"where": { "Срок": [ период.Начало, период.Окончание ] },
			"filter": { }
		};
		let status = document.find("#status").value;
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
		let project = document.find("#project").value;
		if (project)
			query.filter.Проект = project;
		paginator.split(query);
		let records = await db.select(query);
		for (let id of records)
		{
			let record = await db.find(id);
			let template = layout.template("#card");
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
			let оформление = "bg-dark text-white";
			if (record.Статус)
			{
				let статус = await db.find(record.Статус);
				оформление = статус.Оформление;
			}
			template.fill( { "class": оформление } );
			template.fill(record);
			template.out("#content");
			paginator.add();
		}
		await paginator.request(db);
	}
}
