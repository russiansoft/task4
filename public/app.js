
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

// app
let app = new App();
