
import { model } from "./model.js";
import { Template } from "./template.js";

model.classes.Период = class Период
{
	async view(parent)
	{
		let template = new Template();
		await template.load("период.html");
		template.fill(this);
		await template.out(parent);

		// Элементы
		this.from = parent.find("input#from");
		this.to = parent.find("input#to");
	}
};
