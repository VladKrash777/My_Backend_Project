const express = require("express");
const app = express();
const chalk = require("chalk");
const morgan = require("morgan")

// app.use(morgan("tiny"))
// app.use(morgan("dev"))
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(
	morgan(function (tokens, req, res) {
		
		if(tokens.method(req, res ) === "GET") return " vlad vlad vlad"

		// return `${tokens.method(req,res)} 
		// 			${tokens.url(req, res)} 
		// 			${tokens.status(req, res)} 
		// 			${tokens.res(req, res, 'content-length'), '-'} 
		// 			${tokens['response-time'](req, res) } ms`
		// 			.join(' ')
		return [
			tokens.method(req, res),
			tokens.url(req, res),
			tokens.status(req, res),
			tokens.res(req, res, 'content-length'), '-',
			tokens['response-time'](req, res),'ms',	 
		].join(' ')
	}))

	["/get", "GET"]

const PORT = 7171;
app.listen(PORT, () =>
	console.log(chalk.blueBright(`Listening on: http://localhost:${PORT}`))
);
