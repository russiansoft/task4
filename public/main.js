
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

// Тестовое заполнение
async function Заполнить()
{
	let татьяна = await dataset.find(
	{
		from: "Сотрудник",
		filter: { "Наименование": "Чижиченко Татьяна Николаевна" }
	} );
	let ожидания = await dataset.find(
	{
		from: "Статус",
		filter: { "Наименование": "Ожидания и отложено" }
	} );
	let records = await dataset.select(
	{
		from: "Задача",
		take: 50,
		where: { "Срок": [ "2022-01-01", null ] },
		filter:
		{
			//"Постановщик": татьяна.id//,
			"Статус": ожидания.id
		}
	} );
	for (let id of records)
	{
		let record = await dataset.find(id);
		new Template("#карточка").fill(record).out(document.body);
	}
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
	console.log("Идентификатор устройства " + localStorage["device"]);

	let client = "136685971527-6k9gjabo1pj8mnv9d7p91fmuah581o1d.apps.googleusercontent.com";
	let state = localStorage["device"];
	let google = "https://accounts.google.com/o/oauth2/v2/auth" +
				 "?client_id=" + client +
				 "&response_type=code" +
				 "&scope=openid%20email" +
				 "&state=" + state +
				 "&redirect_uri=" + location.origin;
	console.log(google);
	//location.replace(google);
	let child = open(google);
}

// Анализ
function Анализ()
{
	let url = new URL(location);
	if (url.searchParams.has("code"))
	{
		console.log("code: " + url.searchParams.get("code"));
		document.body.append("code: " + url.searchParams.get("code"));
	}
}

// Событие загрузки
onload = async function()
{
	window.dataset = new Dataset();
	await dataset.begin();
	document.onchange = OnChange;
}


