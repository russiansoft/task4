

import { server, auth } from "./server.js";
import { database } from "./database.js";
import { model } from "./model.js";
import { binding } from "./reactive.js";

document.classes["nav-class"] = class
{
	async Create()
	{
		this.user = auth.user ?? "(неизвестный)";
		this.classList.add("navbar", "sticky-top", "navbar-expand");
		let layout = await server.LoadHTML("навигация.html");
		let template = layout.template("#form");
		await template.fill(auth).fill(this).Join(this);
		document.get("button[data-cmd='Login']").show(!auth.user);
		document.get("button[data-cmd='Logout']").show(auth.user);
	}

	async Login()
	{
		auth.google();
	}

	async Logout()
	{
		auth.logout();
	}
};
