
/* <body data-type="Задачи" onload="Загрузка()" data-onsave="Заполнить()">
	<nav class="navbar fixed-top navbar-expand-sm"></nav>
	<header class="container-fluid">
		<div class="row m-2"></div>
	</header>
	<menu class="container-fluid">
	</menu>
	<main class="container-fluid">
	</main>
	<footer>
	</footer>
</body> */

async function form()
{
	let url = new URL(location);
	if (url.searchParams.has("type"))
	{
		let type = url.searchParams.get("type");
		document.title = type;
		await load(type);
	}
}
