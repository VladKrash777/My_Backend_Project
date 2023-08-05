const mongoose = require("mongoose");
const chalk = require("chalk");
const config = require('config')
const ENVIRONMENT = config.get("NODE_ENV");
const DB_NAME = config.get("DB_NAME");
const DB_PASSWORD = config.get("DB_PASSWORD");

if (ENVIRONMENT === "development")
	mongoose
		.connect("mongodb://127.0.0.1:27017/BCard_Vlad_Krash")
		.then(() =>
			console.log(
				chalk.magentaBright(
					"You have been successfully connected to MongoDB Locally !"
				)
			)
		)
		.catch(error =>
			console.log(
				chalk.redBright(`Could not connect to mongoDb locally: ${error}`)
			)
		);



if (ENVIRONMENT === "production")
	mongoose
		.connect(
			`mongodb+srv://vk777:${DB_PASSWORD}@cluster0.jcb7nxj.mongodb.net/`
		)
		.then(() =>
			console.log(
				chalk.magentaBright(
					"You have been successfully connected to Atlas MongoDB !"
				)
			)
		)
		.catch(error =>
			console.log(
				chalk.redBright(`Could not connect to Atlas mongoDb : ${error}`)
			)
		);
