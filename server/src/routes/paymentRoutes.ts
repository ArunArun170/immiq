import { Router } from "express";

import {
  createPaymentOrder,
  verifyPayment,
} from "../controllers/paymentController";

import { authenticate } from "../middleware/auth";

const router = Router();

router.post(
  "/payments/create-order",
  authenticate,
  createPaymentOrder
);

router.post(
  "/payments/verify",
  authenticate,
  verifyPayment
);

export default router;