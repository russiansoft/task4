
// Диалог выбора файла
function FileDialog()
{
}

// Отображение
FileDialog.prototype.show = function()
{
	let input = document.createElement("input");
	input.type = "file";
	//input.accept = "image/*";
	input.style.display = "none";
	input.onchange = function()
	{
		let files = input.files;
		if (!files)
			return;
		let file = files[0];
		let reader = new FileReader();
		reader.onloadend = function()
		{
			let beginning = "base64,";
			let start = reader.result.indexOf(beginning);
			if (start == -1)
				return;
			let base64 = reader.result.slice(start + beginning.length);
			return { "name": file.name, "type": file.type, "data": base64 };
		};
		reader.readAsDataURL(file);
	}
	input.click();
}
