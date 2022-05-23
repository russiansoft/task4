
let count = 0;

// Заполнение
async function Заполнить(clear = false)
{
	// Новая транзакция
	window.dataset = new Dataset();
	await dataset.begin(localStorage["device"]);

	let content = document.querySelector("#content");
	if (clear)
	{
		content.innerHTML = "";
		count = 0;
	}
	let татьяна = await dataset.find(
	{
		"from": "Сотрудник",
		"filter": { "Наименование": "Чижиченко Татьяна Николаевна" }
	} );
	let from = document.querySelector("#from").valueAsDate.toISOString().slice(0, 10);
	let to = document.querySelector("#to").valueAsDate.toISOString().slice(0, 10);
	let query = 
	{
		"from": "Задача",
		"skip": count,
		"take": 5,
		"where": { "Срок": [ from, to ] },
		"filter":
		{
		}
	};
	let status = document.querySelector("#status").value;
	if (status)
		query.filter.Статус = status;
	let records = await dataset.select(query);
	for (let id of records)
	{
		let record = await dataset.find(id);
		new Template("#карточка").fill(record).out(content);
	}
	count += records.length;
	query.skip += 4;
	query.take = 1;
	records = await dataset.select(query);
	let have = records.length > 0;
	if (have)
		document.querySelector("#more").classList.remove("d-none");
	else
		document.querySelector("#more").classList.add("d-none");
}

// Открытие карточки
function Открыть(id)
{
	console.log(id);
	let child = open("task.html?id=" + id);
	if (child == null)
		throw("Ошибка открытия " + location);
	//else
		//child.sessionStorage["form"] = Id;
}

let User = ""; // Имя пользователя

// Установка видимости
function show(selector, visible)
{
	let element = document.querySelector(selector);
	if (element.classList.contains("d-none") == visible)
		element.classList.toggle("d-none");
}

// Обновление видимости
function ОбновитьВидимость()
{
	show("#login", User == "");
	show("#logout", User != "");
}

// Вход
async function Войти()
{
	let auth = await app.auth(localStorage["device"]);
	if (!auth.user)
	{
		let google = await app.google();
		if (!google.client)
			throw "Отсутствет идентификатор клиента Google";
		if (google.uri != location.origin)
			throw "Ошибочный URI перенаправления Google";
		let request = "https://accounts.google.com/o/oauth2/v2/auth" +
					  "?client_id=" + google.client +
					  "&response_type=code" +
					  "&scope=openid%20email" +
					  "&redirect_uri=" + google.uri;
		console.log(request);
		location.replace(request);
	}
}

// Выход
async function Выйти()
{
	app.logout(localStorage["device"]);
	location.replace(location);
}

// Событие загрузки
onload = async function()
{
	// Завершение аутентификации Google
	let url = new URL(location);
	if (url.searchParams.has("code"))
	{
		let code = url.searchParams.get("code");
		let device = localStorage["device"];
		await app.login(code, device);
		location.replace(location.origin);
		return;
	}

	// Идентификация устройства
	if (!localStorage["device"])
		localStorage["device"] = await app.guid();
	let device = localStorage["device"];
	console.log("Идентификатор устройства " + device);

	// Аутентификация
	if (device)
	{
		let auth = await app.auth(device);
		User = auth.user;
		let text = auth.user ? auth.user : "Не определен";
		document.querySelector("#user").innerHTML = text;
	}

	ОбновитьВидимость();

	// Транзакция
	window.dataset = new Dataset();
	await dataset.begin(localStorage["device"]);

	// Обработка изменений полей ввода
	document.onchange = OnChange;

	// Значения по умолчанию
	let today = new Date();
	let from = today.getDate() - today.getDay() + 1;
	let to = from + 6;
	document.querySelector("#from").valueAsDate = new Date(today.setDate(from));
	document.querySelector("#to").valueAsDate = new Date(today.setDate(to));


	// Значения статуса
	let list = document.querySelector("#status");
	list.innerHTML = "";
	let empty = { "id": "", "Наименование": "<не выбран>" };
	new Template("#templatestatus").fill(empty).out(list);
	let records = await dataset.select( { "from": "Статус" } );
	for (let id of records)
	{
		let record = await dataset.find(id);
		new Template("#templatestatus").fill(record).out(list);
	}

	Заполнить(true);
}


