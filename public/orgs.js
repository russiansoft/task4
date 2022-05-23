
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
	let query = 
	{
		"from": "Организация",
		"skip": count,
		"take": 15
	};
	let records = await dataset.select(query);
	for (let id of records)
	{
		let record = await dataset.find(id);
		new Template("#карточка").fill(record).out(content);
	}
	count += records.length;
	query.skip += 14;
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
	let child = open("org?id=" + id);
	if (child == null)
		throw("Ошибка открытия " + location);
	//else
		//child.sessionStorage["form"] = Id;
}

// Событие загрузки
onload = async function()
{
	// Идентификация устройства
	if (!localStorage["device"])
		localStorage["device"] = await app.guid();
	let device = localStorage["device"];
	console.log("Идентификатор устройства " + device);

	// Транзакция
	window.dataset = new Dataset();
	await dataset.begin(localStorage["device"]);

	// Обработка изменений полей ввода
	document.onchange = OnChange;

	Заполнить(true);
}


