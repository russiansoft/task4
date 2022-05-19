
function ShowMessage(message, type)
{
	let wrapper = document.createElement('div');
	wrapper.innerHTML = '<div class="alert alert-' + type + 
						' alert-dismissible" role="alert">' + message + 
						'<button type="button" class="btn-close" ' +
						'data-bs-dismiss="alert" aria-label="Close"></button></div>';
	document.querySelector("body").append(wrapper);
}

// Вывод связанных данных
function DataOut(record)
{
	for (let element of document.querySelectorAll("*"))
	{
		if (!element.hasAttribute("bind"))
			continue;
		let bind = element.getAttribute("bind");
		element.value = record[bind];
	}
	document.record = record.id;
}

// При изменении
function OnChange(event)
{
	let element = event.target;
	if (!element.hasAttribute("bind"))
		return;
	let changes = { "id": document.record };
	changes[element.getAttribute("bind")] = element.value;
	console.log(JSON.stringify(changes));
	dataset.save( [ changes ] );
}

// При нажатии кнопки
async function Shot()
{
	dataset.commit();
}

let count = 0;

// Тестовое заполнение
async function Заполнить(clear = false)
{
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
	let ожидания = await dataset.find(
	{
		"from": "Статус",
		"filter": { "Наименование": "Ожидания и отложено" }
	} );
	let query = 
	{
		"from": "Задача",
		"skip": count,
		"take": 4,
		"where": { "Срок": [ "2022-01-01", null ] },
		"filter":
		{
			//"Постановщик": татьяна.id//,
			"Статус": ожидания.id
		}
	};
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
	//new Template("#прокрутка").out(document.body);
}

// Открытие карточки
function Открыть(id)
{
	console.log(id);
	let child = open(location);
	if (child == null)
		alert("Ошибка открытия " + location);
	//else
		//child.sessionStorage["form"] = Id;
}

// Аутентификация
async function Войти()
{
	if (!localStorage["device"])
		localStorage["device"] = await app.guid();
	let device = localStorage["device"];
	console.log("Идентификатор устройства " + device);
	let login = await app.login(device);
	if (!login.user)
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

// Завершить
async function Завершить()
{
	let url = new URL(location);
	if (url.searchParams.has("code"))
	{
		let code = url.searchParams.get("code");
		console.log("code: " + code);
		await app.auth(code, localStorage["device"]);
		location.replace(location.origin);
	}
}

// Событие загрузки
onload = async function()
{
	window.dataset = new Dataset();
	await dataset.begin();
	document.onchange = OnChange;
}


