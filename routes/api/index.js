const router = require('express').Router();
const developerRoutes = require('./developerRoutes');
const postRoutes = require('./postRoutes');

router.use('/posts', postRoutes);
router.use('/developers', developerRoutes);

module.exports = router;
