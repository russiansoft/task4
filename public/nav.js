
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
export async function LoadNav()
{
	await auth.load();

	// Вывод
	let template = new Template();
	await template.load("nav.html");
	let name = auth.user ? auth.user : "";
	template.fill( { "user": name } );
	template.out("nav");

	// Обновление видимости
	display("#login", name == "");
	display("#logout", name != "");

	// Отступ
	let next = document.find("nav").nextElementSibling;
	if (next)
		next.style.marginTop = document.find("nav").offsetHeight + "px";
}
