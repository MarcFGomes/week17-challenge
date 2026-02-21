const router = require('express').Router();
const postRoutes = require('./developerRoutes');
const tagRoutes = require('./postRoutes');

router.use('/posts', postRoutes);
router.use('/tags', tagRoutes);

module.exports = router;
