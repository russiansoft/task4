
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
