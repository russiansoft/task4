
// Приложение
function App()
{
}

// call
App.prototype.call = function(method, list = { })
{
	return CallServer("app", method, list);
}

// platform
App.prototype.platform = function()
{
	return this.call("platform");
}

// guid
App.prototype.guid = async function()
{
	return (await this.call("guid")).value;
}

// app
let app = new App();
