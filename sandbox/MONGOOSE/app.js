const express = require("express");
const app = express();
const chalk = require("chalk");
const mongoose = require("mongoose");
const lodash = require("lodash")

app.use(express.json());

const PORT = 8989;
app.listen(PORT, () => {
	console.log(chalk.blueBright(`Listening on: http://localhost:${PORT}`));
	mongoose
		.connect("mongodb://127.0.0.1:27017/mongoose-sandbox")
		.then(() => console.log(chalk.magentaBright("connected to MongoDb!")))
		.catch(error =>
			console.log(
				chalk.redBright.bold(`could not connect to mongoDb: ${error}`)
			)
		);
});

const handleError = (res, error) => {
	console.log(chalk.redBright(`Mongoose Error: ${error.message}`));
	res.status(400).send(`Mongoose Error: ${error.message}`);
};

/*** basic Schema ***/
// const schema = new mongoose.Schema({});

/*** Schema Values Types  ***/
// const schema = new mongoose.Schema({
// 	string: String,
// 	number: Number,
// 	bool: Boolean,
// 	date: Date,
// 	id: mongoose.Types.ObjectId,
// 	array: [String],
// });

/***** Schema in Schema *****/
// const nameSchema = new mongoose.Schema({
// 	first: String,
// 	last: String,
// });

// const schema = new mongoose.Schema({
// 	name: nameSchema,
// });

/***** Schema validate key *****/
// const schema = new mongoose.Schema({
// 	title: {
// 		type: String,
// 		trim: true, // מוריד רווחים
// 		lowercase: true,
// 		minLength: 2,
// 		maxLength: 256,
// 		default: "did not enter title",
// 		required: true, // requireed = must be 
// 	},
// });

/***** Schema validate unique *****/
// const schema = new mongoose.Schema({
// 	email: {
// 		type: String,
// 		required: true,
// 		unique: true,
// 	},
// 	password: {
// 		type: String,
// 		required: true,
// 	},
// });

/***** Schema validate regex *****/
// const schema = new mongoose.Schema({
// 	password: {
// 		type: String,
// 		match: RegExp(
// 			/((?=.*\d{1})(?=.*[A-Z]{1})(?=.*[a-z]{1})(?=.*[!@#$%^&*-]{1}).{7,20})/
// 		),
// 		required: true,
// 	},
// });


/***** mongoose queries from 27.07.2023 *****/
/***** 1) SAVE QUERY *****/
// const schema = new mongoose.Schema({
// 	string: String,
// 	number: Number,
// 	bool: Boolean,
// 	date: { type: Date, default: Date.now },
// });
// 
const schema = new mongoose.Schema({
	first : String,
	last : String,
	age: Number,
	isBusiness: Boolean,
	date: { type: Date, default: Date.now },
});

const Test = mongoose.model("test", schema);

app.post("/", async (req, res) => {
	try {
		const dataFromReqBody = req.body;
		const user = new Test(dataFromReqBody);
		await user.save();
		return res.send(user);
	} catch (error) {
		console.log(chalk.redBright(`Mongoose Schema Error: ${error.message}`));
		res.status(400).send(error.message);
	}
});

/***** 2) FIND QUERY *****/
app.get("/", async (req, res) => {
	try {
		const instance = await Test.find();
		res.send(instance);
	} catch (error) {
		handleError(res, error);
	}
});

app.get("/query", async (req, res) => {
	try {
		const instance = await Test.find({number: {$gt:2 , $lt:4} });
		res.send(instance);
	} catch (error) {
		handleError(res, error);
	}
});
// app.get("/tests", async (req, res) => {
// 	try {
// 		const instance = await Test.find({age: {$lte:35 , }},{_id:1});
// 		res.send(instance);
// 	} catch (error) {
// 		handleError(res, error);
// 	}
// });

// The method return array
app.get("/filter", async (req, res) => {
	try {
		const instance = await Test.find({}, { string: 1, _id: 0 });
		res.send(instance);
	} catch (error) {
		handleError(res, error);
	}
});

// The method return object
app.get("/find-one/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const isExist = await Test.findOne({ _id: id });
		// const instance = await Test.findOne({ number: { $gte: 2 } });
		if (!isExist) throw new Error("Did not found an item with this id");
		res.send(isExist);
	} catch (error) {
		handleError(res, error);
	}
});


app.get("/count", async (req, res) => {
	try {
		const instance = await Test.find({}).count();
		return res.send({"num Of Items": instance});
	} catch (error) {
		handleError(res, error);
	}
});

app.get("/select", async (req, res) => {
	try {
		const instance = await Test.find({}).select(["first", "last", "-_id"]);
		return res.send(instance);
	} catch (error) {
		handleError(res, error);
	}
});

app.get("/sort", async (req, res) => {
	try {
		const instance = await Test.find({}).sort({ date: 1 });
		return res.send(instance);
	} catch (error) {
		handleError(res, error);
	}
});


app.get("/select-sort", async (req, res) => {
	try {
		const instance = await Test.find({})
		.select(["first", "-_id"])
		.sort({ first: 1 });
		return res.send(instance);
	} catch (error) {
		handleError(res, error);
	}
});


app.get("/findById/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const user = await Test.findById(id);
		console.log(user);
		if (!user) throw new Error("Did not found an item with this id");
		res.send(user);
	} catch (error) {
		handleError(res, error);
	}
});


app.put("/findByIdAndUpdate/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const user = req.body
		const userFromDB = await Test.findByIdAndUpdate(id, user, { new: true});
		console.log(userFromDB);
		if (!userFromDB) throw new Error("Did not found an item with this id");
		res.send(userFromDB);
	} catch (error) {
		handleError(res, error);
	}
});


app.delete("/findByIdAndDelete/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const deleteUserFromDB = await Test.findByIdAndDelete(id);
		if (!deleteUserFromDB) throw new Error("Did not found an item with this id");
		res.send(deleteUserFromDB);
	} catch (error) {
		handleError(res, error);
	}
});




/***************** deleted *************************/

const deleteItemSchema = new mongoose.Schema({
	first: String,
	last: String,
	age: Number,
	isBusiness: Boolean,
	date: Date,
});

const Deleted = mongoose.model("deleted", deleteItemSchema);

app.delete("/findByIdAndDelete/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const deletedUserFromDB = await Test.findByIdAndDelete(id);
		if (!deletedUserFromDB) throw new Error("Did not found user with this id");

		const normalizedUserForArchive = lodash.pick(
			deletedUserFromDB,
			"first",
			"last",
			"age",
			"date",
			"isBusiness"
		);

		const archivedTest = new Deleted(normalizedUserForArchive);
		const archivedFromDB = await archivedTest.save();
		res.send(archivedFromDB);
	} catch (error) {
		handleError(res, error);
	}
});


/***************** Aggregation Operations *************************/
app.patch("/changeBizStatus/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const pipeline = [{ $set: { isBusiness: { $not: "$isBusiness" } } }];
		const configuration = { new: true };

		const userFromBd = await Test.findByIdAndUpdate(
			id,
			pipeline,
			configuration
		);
		if (!userFromBd)
			throw new Error("No user with this id was found in the database!");
		return res.send(userFromBd);
	} catch (error) {
		return handleError(res, error);
	}
});







// ***************** unique number *********************************

// const generateUniqueNumber = async () => {
// 	try {
// 		const random = lodash.random(1,3)
// 		const isExist = await Test.findOne({age: random},{age: 1, _id:0})
// 		if(isExist) return generateUniqueNumber()
// 		return Promise.resolve(random)
// 	} catch (error) {
// 		return Promise.reject `Mongoose Error: ${error.message}`
// 	}
// }

// fn().then(data => console.log(data)).catch(error => console.log(error))

// const fn = async ()=> {
// 	const number = await generateUniqueNumber()
// 	return number
// }





// app.put("/",async (req, res)=>{
// 	try {
// 		const user = 
// 	} catch (error) {
		
// 	}
// })





// middlewares תפיסת תקלות של ה 
app.use((err, req, res, next) => {
	console.error(chalk.redBright(err.message));
	res.status(500).send(err.message);
});















