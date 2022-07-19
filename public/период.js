
export class Период
{
	// async create()
	// {
	// 	// Значения по умолчанию
	// 	let today = new Date();
	// 	let day = today.getDay() - 1;
	// 	if (day < 0)
	// 		day += 7;
	// 	let from = today.getDate() - day;
	// 	let to = from + 6;
	// 	this.Начало = new Date(Date.UTC(today.getFullYear(), 0, 1)).toISOString().slice(0, 10);
	// 	this.Окончание = new Date().toISOString().slice(0, 10);
	// 	//console.log("Создан период " + JSON.stringify(this));
	// 	//valueAsDate
	// }
	async read()
	{
	}
	async view(parent)
	{
		let template = new Template();
		await template.load("период.html");
		template.fill(this);
		await template.out(parent);

		// Элементы
		this.from = parent.querySelector("#manuscript-period-from");
		this.to = parent.querySelector("#manuscript-period-to");
	}
}

// Компонент выбора периода
class ManuscriptPeriod extends HTMLElement
{
	// При вставке компонента
	async connectedCallback()
	{
		// События
		this.from.addEventListener("change", this.change);
		this.to.addEventListener("change", this.change);
	}

	// Получение даты начала
	get fromDate()
	{
		if (!this.from.value)
			return "";
		return this.from.valueAsDate.toISOString().slice(0, 10);
	}

	// Получение даты окончания
	get toDate()
	{
		if (!this.to.value)
			return "";
		return this.to.valueAsDate.toISOString().slice(0, 10);
	}
}
