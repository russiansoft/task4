
import { model } from "./model.js";
import { server } from "./server.js";

Number.prototype.format = function(options = { leadZeroes: null } )
{
	let present = "" + this;
	if ("leadZeroes" in options)
	{
		while (present.length < options.leadZeroes)
			present = "0" + present;
	}
	return present;
}

Date.prototype.toXML = function()
{
	return this.getFullYear().format( { "leadZeroes": 4 } ) + "-" +
	       (this.getMonth() + 1).format( { "leadZeroes": 2 } ) + "-" +
		   this.getDate().format( { "leadZeroes": 2 } );
}

document.classes["period-class"] = class
{
	async Create()
	{
		let layout = await server.LoadHTML("период.html");
		let template = layout.template();
		await template.Join(this);

		this.from = this.get("#from");
		this.to = this.get("#to");

		let today = new Date();
		let start = "";
		let finish = "";
		if (this.dataset.interval == "day")
		{
			start = today;
			finish = today;
		}
		else if (this.dataset.interval == "month")
		{
			start = new Date(today.getFullYear(), today.getMonth(), 1);
			finish = new Date(today.getFullYear(), today.getMonth() + 1, 0);
		}
		this.from.value = start.toXML();
		this.to.value = finish.toXML();
	}

	async ПредыдущийПериод()
	{
		let start = new Date(this.from.value);
		let finish = null;
		if (this.dataset.interval == "day")
		{
			start = new Date(start.getFullYear(), start.getMonth(), start.getDate() - 1);
			finish = start;
		}
		else if (this.dataset.interval == "month")
		{
			start = new Date(start.getFullYear(), start.getMonth() - 1, 1);
			finish = new Date(start.getFullYear(), start.getMonth() + 1, 0);
		}
		this.from.value = start.toXML();
		this.to.value = finish.toXML();
	}

	async СледующийПериод()
	{
		let start = new Date(this.from.value);
		let finish = null;
		if (this.dataset.interval == "day")
		{
			start = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);
			finish = start;
		}
		else if (this.dataset.interval == "month")
		{
			start = new Date(start.getFullYear(), start.getMonth() + 1, 1);
			finish = new Date(start.getFullYear(), start.getMonth() + 1, 0);
		}
		this.from.value = start.toXML();
		this.to.value = finish.toXML();
	}	
};
