import { Router } from "express";

import {
  getMyInvoices,
  getMyInvoiceById,
  getAdminInvoices,
} from "../controllers/invoiceController";

import { authenticate } from "../middleware/auth";

const router = Router();

router.get(
  "/invoices/my",
  authenticate,
  getMyInvoices
);

router.get(
  "/invoices/my/:invoiceId",
  authenticate,
  getMyInvoiceById
);

router.get(
  "/admin/invoices",
  authenticate,
  getAdminInvoices
);

export default router;
