
let url = new URL(location);
let type = decodeURI(url.pathname);
if (type.startsWith("/"))
	type = type.substring(1);
if (!type)
	type = "задачи";
document.body.dataset.class = type;
let script = document.createElement("script");
script.type = "module";
script.src = type + ".js";
document.head.append(script);
