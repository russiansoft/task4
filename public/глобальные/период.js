
export class Период
{
	async view(parent)
	{
		let template = new Template();
		await template.load("период.html");
		template.fill(this);
		await template.out(parent);

		// Элементы
		this.from = parent.find("#manuscript-period-from");
		this.to = parent.find("#manuscript-period-to");
	}
}
