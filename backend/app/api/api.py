from fastapi import APIRouter

from app.api.routes import vendor, product, line, invoice, transaction, customer

router = APIRouter(prefix="/api")
router.include_router(vendor.router)
router.include_router(product.router)
router.include_router(line.router)
router.include_router(invoice.router)
router.include_router(transaction.router)
router.include_router(customer.router)
