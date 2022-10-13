
document.head.insertAdjacentHTML("beforeend", `
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link rel="icon" href="favicon.svg">
	<link rel="stylesheet" href="bootstrap.min.css">
	<link rel="stylesheet" href="bootstrap-icons.css">
	<link rel="stylesheet" href="col.css">
	<link rel="stylesheet" href="style.css"/>`);

let bsminjs = document.createElement("script");
bsminjs.src = "bootstrap.bundle.min.js";
document.head.append(bsminjs);

import "./навигация.js";
import "./title.js";
import "./период.js";
