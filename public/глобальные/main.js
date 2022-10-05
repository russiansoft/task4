
import { model } from "./model.js";
import { binding } from "./reactive.js";
import { Layout } from "./template.js";

model.classes.Main = class Main
{
	async view(element)
	{

		let layout = await new Layout().load("main.html");
		await layout.template("#form").fill(this).out(element);
		binding(element);
	}
};