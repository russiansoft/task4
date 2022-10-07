
import { server } from "./manuscript.js";

document.classes["title-class"] = class
{
	async Create()
	{
		let layout = await server.LoadHTML("title.html");
		await layout.template().fill(this.dataset).Join(this);
	}

	async Close()
	{
		close();
	}
}
