
// Приложение
function App()
{
}

// call
App.prototype.call = function(method, list = { } )
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

// login
App.prototype.login = async function(device)
{
	return (await this.call("login", { "device": device } ));
}

// google
App.prototype.google = async function()
{
	return (await this.call("google"));
}

// auth
App.prototype.auth = async function(code, device)
{
	return (await this.call("auth", { "code": code, "device": device } ));
}

// app
let app = new App();
