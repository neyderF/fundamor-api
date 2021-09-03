const express = require("express");
const router = express.Router();
const adoptionQuestionController = require("../controllers/adoptionQuestionController");
const verify = require("../middleware/auth/verify");

// list of question associated to adoption
router.get("/:id", verify, adoptionQuestionController.list);

// associate question to adoption
router.post("/", verify, adoptionQuestionController.create);

// delete adoptionQuestion
router.delete("/:id", verify, adoptionQuestionController.delete);

// delete multiple adoptionQuestion
router.delete("/", verify, adoptionQuestionController.deleteMultiple);

module.exports = router;

