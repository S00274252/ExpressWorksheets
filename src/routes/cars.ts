import { Router } from 'express';
import { CarController } from '../controllers/cars';
import {authenticateKey} from '../middleware/auth.middleware';
import {loggerMiddleware} from '../middleware/logger.middleware';

const router = Router();
const carController = new CarController();

router.get('/', carController.getCars);

router.get('/:id', carController.getCarById);
router.post('/', authenticateKey, loggerMiddleware, carController.createCar);
router.put('/:id', carController.updateCar);
router.delete('/:id', carController.deleteCar);

export default router;
