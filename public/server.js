
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
	            ") 🔴 " + JSON.stringify(json));
	return json;
}
