const {Router} = require('express');
const SectionController = require('../../controller/section-controller');

const router = Router();
const sectionCtrl = new SectionController();

router.get('/', sectionCtrl.getAll);
router.get('/:sectionId', sectionCtrl.getOne);
router.post('/', sectionCtrl.create);
router.delete('/:sectionId', sectionCtrl.delete);
router.put('/:sectionId', sectionCtrl.update);

module.exports = router;