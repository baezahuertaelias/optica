const express = require('express');
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', itemController.index);
router.get('/:id', itemController.show);
router.post('/', itemController.store);
router.put('/:id', itemController.update);
router.delete('/:id', itemController.destroy);

module.exports = router;