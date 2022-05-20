
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

// auth
App.prototype.auth = async function(device)
{
	return (await this.call("auth", { "device": device } ));
}

// google
App.prototype.google = async function()
{
	return (await this.call("google"));
}

// login
App.prototype.login = async function(code, device)
{
	return (await this.call("login", { "code": code, "device": device } ));
}


// logout
App.prototype.logout = async function(device)
{
	return (await this.call("logout", { "device": device } ));
}

// app
let app = new App();
