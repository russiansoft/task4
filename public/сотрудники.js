
let count = 0;

async function Заполнить(очистить = true)
{
	await database.begin();

	if (очистить)
	{
		element("#content").innerHTML = "";
		count = 0;
	}
	let query = 
	{
		"from": "Сотрудник",
		"skip": count,
		"take": 15
	};
	let search = element("#search").value;
	if (search)
		query.search = search;
	let records = await database.select(query);
	for (let id of records)
	{
		let record = await database.find(id);
		new Template("#card").fill(record).out("#content");
	}
	count += records.length;
	query.skip += 14;
	query.take = 1;
	records = await database.select(query);
	display("#more", records.length > 0);
}

onload = async function()
{
	await LoadNav();
	Заполнить(true);
	element("#search").focus();
}
