const router = require("express").Router();
const {
  getDevelopers,
  getSingleDeveloper,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
  addConnection,
  removeConnection,
} = require("../../controllers/developerController");

// /api/developers
router.route("/")
  .get(getDevelopers)
  .post(createDeveloper);

// /api/developers/:developerId
router.route("/:developerId")
  .get(getSingleDeveloper)
  .put(updateDeveloper)
  .delete(deleteDeveloper);

// /api/developers/:developerId/connections/:connectionId
router.route("/:developerId/connections/:connectionId")
  .post(addConnection)
  .delete(removeConnection);

module.exports = router;