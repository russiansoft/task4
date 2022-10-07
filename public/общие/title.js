
import { server } from "./manuscript.js";

document.classes["title-class"] = class
{
	async Create()
	{
		let layout = await server.LoadHTML("title.html");
		await layout.template().fill(this.dataset).Join(this);
		if (this.dataset.text)
			document.title = this.dataset.text;
		this.get(".cmd-ok").show(document.body.dataset.purpose == "edit");
	}

	async close()
	{
		close();
	}
}
