const express = require("express")
const { getCards,
	getCard,
	getMyCards,
	createCard,
	editCard,
	likeCard,
	deleteCard } = require("../controllers/cardsController")
const router = express.Router()

router.get("/", getCards)
router.get("/my-cards", getMyCards)
router.get("/:cardId", getCard)
router.post("/", createCard)
router.put("/:cardId", editCard)
router.patch("/:cardId", likeCard)
router.delete("/:cardId", deleteCard)

module.exports = router