
// Видеозахват
function Capture()
{
}

// call
Capture.prototype.call = function(method, list = { })
{
	return CallServer("capture", method, list);
}

// select
Capture.prototype.select = function()
{
	return this.call("select");
}

// capture
Capture.prototype.capture = function(device)
{
	return this.call("capture", { "device": device } );
}

// capture
let capture = new Capture();
