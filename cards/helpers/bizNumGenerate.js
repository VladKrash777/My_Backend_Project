const lodash = require("lodash");
const Card = require("../models/mongoose/Card");

const bizNumGenerate = async () => {
	try {
		const random = lodash.random(100_000, 999_999);
		const card = await Card.findOne(
			{ bizNumber: random },
			{ bizNumber: 1, _id: 0 }
		);
		if (card) bizNumGenerate();
		return random;
	} catch (error) {
		return Promise.reject(`Mongoose Error: ${error.message}`);
	}
};

module.exports = bizNumGenerate;
