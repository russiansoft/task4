
import { server, auth, hive } from "./server.js";
import { Database, database } from "./database.js";
import "./client.js";

document.classes["form-class"] = class
{
	async Create()
	{
		// Аутентификация
		await auth.load();

		// Начало транзакции
		await database.transaction();

		await document.template().Join(this);
		// binding(element);
	}
};
