
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
function Войти()
{
	let client = "1018061910916-ugbu0ph8b2dnaqaqn9nm3817l4lu45hp.apps.googleusercontent.com";
	let state = "123";
	let uri = "https://xn--40-6kcai3c0bf.xn--p1ai";
	let google = "https://accounts.google.com/o/oauth2/v2/auth" +
				 "?client_id=" + client +
				 "&response_type=code" +
				 "&scope=openid%20email" +
				 "&state=" + state +
				 "&redirect_uri=" + uri;
	//location.replace(google);
	let child = open(google);
}

// Событие загрузки
onload = async function()
{
	window.dataset = new Dataset();
	await dataset.begin();
	document.onchange = OnChange;
}


