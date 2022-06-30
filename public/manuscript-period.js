
// Компонент выбора периода
class ManuscriptPeriod extends HTMLElement
{
	// При вставке компонента
	async connectedCallback()
	{
		// Вывод шаблона
		let template = new Template();
		await template.load("manuscript-period.html");
		await template.out(this);

		// Элементы
		this.from = this.querySelector("#manuscript-period-from");
		this.to = this.querySelector("#manuscript-period-to");
		this.today = this.querySelector("#manuscript-period-today");

		// Значения по умолчанию
		let today = new Date();
		let day = today.getDay() - 1;
		if (day < 0)
			day += 7;
		let from = today.getDate() - day;
		let to = from + 6;
		this.from.valueAsDate = new Date(new Date().setDate(from));
		this.to.valueAsDate = new Date(new Date().setDate(to));

		// События
		this.from.addEventListener("change", this.change);
		this.to.addEventListener("change", this.change);
		this.today.addEventListener("click", (event) =>
		{
			this.from.valueAsDate = new Date();
			this.to.valueAsDate = new Date();
			this.dispatchEvent(new Event("change", { "bubbles": true } ));
		} );
	}

	// Получение даты начала
	get fromDate()
	{
		return this.from.valueAsDate.toISOString().slice(0, 10);
	}

	// Получение даты окончания
	get toDate()
	{
		return this.to.valueAsDate.toISOString().slice(0, 10);
	}
}

// Регистрация компонента
if (!customElements.get("manuscript-period"))
	customElements.define("manuscript-period", ManuscriptPeriod);

