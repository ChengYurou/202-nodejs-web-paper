const {Router} = require('express');
const PaperController = require('../../controller/paper-controller');

const router = Router();
const paperCtrl = new PaperController();

router.get('/', paperCtrl.getAll);
router.get('/:paperId', paperCtrl.getOne);
router.post('/', paperCtrl.create);
router.delete('/:paperId', paperCtrl.delete);
router.put('/:paperId', paperCtrl.update);

module.exports = router;