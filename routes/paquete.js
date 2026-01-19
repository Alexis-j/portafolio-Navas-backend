import { getPaquetes, postPaquete } from '../controllers/paquetesController.js';

import express from 'express';

const router = express.Router();

router.get('/', getPaquetes);
router.post('/', postPaquete);

export default router;
