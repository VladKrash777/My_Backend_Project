const validateCard = require("../models/joi/validateCard")
const { handleError } = require("../../utils/handleErrors")
const Card = require("../models/mongoose/Card")
const normalizeCard = require("../helpers/normalizeCard");


const getCard = async (req, res) => {
	try {
		const { id } = req.params;
		const card = await getCard(id);
		return res.send(card);
	} catch (error) {
		return handleError(res, error.status || 500, error.message);
	}
}

const getMyCards = async (req, res) => {
	try {
		if (!req.user.isBusiness)
			throw new Error("Only business user can see saved Cards");
		const { _id } = req.user;
		const myCards = await Card.find({ user_id: _id });
		if (!myCards) throw new Error("The user doesn't have any Cards");
		res.status(201).send(myCards);
	} catch (error) {
		handleError(res, 403, error.message);
	}
}

const getCards = async (req, res) => {
	try {
		const cards = await Card.find().sort({ createdAt: "descending" });
		return res.send(cards);
	} catch (error) {
		return handleError(res, 500, `Mongoose Error: ${error.message}`);
	}
};



const createCard = async (req, res) => {
	try {
		const card = req.body;
		const user = req.user;

		if (!user.isBusiness)
			throw new Error(
				"You must be a business user to create business card"
			);

		const { error } = validateCard(card);
		if (error)
			return handleError(res, 400, `Joi Error: ${error.details[0].message}`);

		const normalizedCard = normalizeCard(card, user._id);

		const cardToDB = new Card(normalizedCard);
		const cardFromDB = await cardToDB.save();
		res.send(cardFromDB);
	} catch (error) {
		return handleError(res, 500, `Mongoose Error: ${error.message}`);
	}
};


const editCard = async (req, res) => {
	try {
		console.log("test 1");
		const { _id } = req.user;
		const card = req.card;
		if (`${card.user_id}` !== _id)
			throw new Error(
				"Only Cards maker can change her Cards "
			);
		const cardFromClient = req.body;
		console.log(cardFromClient);
		const editCard = await Card.findByIdAndUpdate(card._id, cardFromClient, {
			new: true,
		});
		if (!editCard)
			throw new Error("Updating Card Error");
		res.status(201).send(editCard);
	} catch (error) {
		handleError(res, 400, error.message);
	}
}

const deleteCard = async (req, res) => {
	try {
		const user = req.user;
		const { cardID } = req.params;
		const card = await Card.findById(cardID);

		if (!user.isAdmin && user._id !== `${card.user_id}`)
			throw new Error(
				"Only admin or card maker can confirm this action"
			);

		const deleteCard = await Card.findByIdAndDelete(cardID);

		console.log(deleteCard);
		if (!deleteCard) throw new Error("ID not found");
		res.status(201).send(deleteCard);
	} catch (error) {
		console.log("test");
		handleError(res, 403, `mongoDB Error: ${error.message}`);
	}
}

const likeCard = async (req, res) => {
	try {
		const userId = req.user._id;
		const id = req.params.cardID;
		const card = await Card.findById(id);
		console.log(card);
		if (!card)
			throw new Error("Card ID cannot found in database");
		const likesCard = card.likes.findIndex((id) => id === userId);

		if (likesCard === -1) {
			card.likes.push(userId);
			card.save();
		}
		if (likesCard >= 0) {
			card.likes.splice(likesCard, likesCard + 1);
			card.save();
		}
		res.status(201).send(card);
	} catch (error) {
		handleError(res, 400, error.message);
	}
}





exports.getCard = getCard
exports.getMyCards = getMyCards
exports.getCards = getCards
exports.createCard = createCard
exports.editCard = editCard
exports.deleteCard = deleteCard
exports.likeCard = likeCard
