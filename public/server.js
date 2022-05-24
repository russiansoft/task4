
// Вызов сервера
async function CallServer(gateway, method, list = { } )
{
	let options = 
	{
		"method": "PUT",
		"headers": { "gateway": gateway },
		"body": JSON.stringify(list)
	};
	let response = await fetch(method, options);
	let json = await response.json();
	if (json.error)
		throw "ОШИБКА СЕРВЕРА: " + json.error;
	console.log("" + gateway + "." + method +
	            "(" + JSON.stringify(list) +
	            ") 🟩 " + JSON.stringify(json));
	return json;
}

function ShowMessage(message, type)
{
	let wrapper = document.createElement('div');
	wrapper.innerHTML = '<div class="alert alert-' + type + 
						' alert-dismissible" role="alert">' + message + 
						'<button type="button" class="btn-close" ' +
						'data-bs-dismiss="alert" aria-label="Close"></button></div>';
	document.querySelector("body").append(wrapper);
}

function format(value, type)
{
	if (type == "date")
	{
		if (value.length == 10)
			return value.slice(8, 10) + "." +
			       value.slice(5, 7) + "." +
				   value.slice(0, 4);
	}
	else if (type == "time")
	{

		let time = parseFloat(value).toFixed(2);
		if (time.length < 5)
		time = "0" + time;
		return time.replace(".", ":");
	}
	else if (type == "value")
	{
		if (typeof value == "Date")
			return value.toISOString().slice(0, 10);
	}
	return value;
}

// Вывод связанных данных
function DataOut(record)
{
	for (let element of document.querySelectorAll("*"))
	{
		if (!element.hasAttribute("bind"))
			continue;
		let bind = element.getAttribute("bind");
		if (element.type == "time")
			element.value = format(record[bind], element.type);
		else
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
	let changed = { "id": document.record };
	changed[element.getAttribute("bind")] = element.value;
	console.log("Изменения: " + JSON.stringify(changed));
	dataset.save( [ changed ] );
}
