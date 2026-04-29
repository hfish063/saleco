from fastapi import APIRouter, Depends, HTTPException

from app.database import get_db
from app.models import InvoiceCreate, InvoiceUpdate

router = APIRouter(prefix="/invoices")


@router.get("/all")
def get_all_invoices(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)

    query = "SELECT * FROM INVOICE"
    cursor.execute(query)
    return cursor.fetchall()


@router.post("/save")
def save_invoice(invoice: InvoiceCreate, db=Depends(get_db)):
    invoice_data = (
        invoice.INV_NUMBER,
        invoice.CUST_NUMBER,
        invoice.INV_DATE,
        invoice.INV_SUBTOTAL,
        invoice.INV_TAX,
        invoice.INV_TOTAL,
        invoice.INV_PAY_TYPE,
        invoice.INV_PAY_AMOUNT,
        invoice.INV_BALANCE,
    )

    try:
        cursor = db.cursor()
        cursor.execute(
            """
            INSERT INTO INVOICE
            (INV_NUMBER, CUST_NUMBER, INV_DATE, INV_SUBTOTAL, INV_TAX, INV_TOTAL, INV_PAY_TYPE, INV_PAY_AMOUNT, INV_BALANCE)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            invoice_data,
        )

        db.commit()
    except:
        raise HTTPException(status_code=500, detail="Failed to save invoice")


@router.put("/update/{id}")
def update_invoice(id: int, invoice: InvoiceUpdate, db=Depends(get_db)):
    invoice_data = (
        invoice.CUST_NUMBER,
        invoice.INV_DATE,
        invoice.INV_SUBTOTAL,
        invoice.INV_TAX,
        invoice.INV_TOTAL,
        invoice.INV_PAY_TYPE,
        invoice.INV_PAY_AMOUNT,
        invoice.INV_BALANCE,
    )
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute(
            """
            UPDATE INVOICE
            SET CUST_NUMBER = %s, INV_DATE = %s, INV_SUBTOTAL = %s, INV_TAX = %s, INV_TOTAL = %s, INV_PAY_TYPE = %s, INV_PAY_AMOUNT = %s, INV_BALANCE = %s
            WHERE INV_NUMBER = %s
            """,
            (*invoice_data, id),
        )
        db.commit()
    except:
        raise HTTPException(status_code=500, detail="Failed to update invoice")


@router.delete("/delete/{invoice_id}", status_code=204)
def delete_invoice_by_id(invoice_id: int, db=Depends(get_db)):
    cursor = db.cursor()

    cursor.execute(
        """
                   DELETE FROM LINE WHERE INV_NUMBER = %s""",
        [invoice_id],
    )

    cursor.execute(
        """
                   DELETE FROM INVOICE WHERE INV_NUMBER = %s""",
        [invoice_id],
    )

    db.commit()
