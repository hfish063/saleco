from fastapi import APIRouter, Depends, HTTPException

from app.database import get_db
from app.models import CustomerCreate, CustomerUpdate

router = APIRouter(prefix="/customers")


@router.get("/all")
def get_all_customers(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)

    query = "SELECT * FROM CUSTOMER"
    cursor.execute(query)
    return cursor.fetchall()


@router.post("/save")
def save_customer(customer: CustomerCreate, db=Depends(get_db)):
    customer_data = (
        customer.CUST_NUMBER,
        customer.CUST_FNAME,
        customer.CUST_LNAME,
        customer.CUST_INITIAL,
        customer.CUST_AREACODE,
        customer.CUST_PHONE,
        customer.CUST_BALANCE,
        customer.CUST_PASSWORD,
    )

    try:
        cursor = db.cursor()
        cursor.execute(
            """
                        INSERT INTO CUSTOMER 
                        (CUST_NUMBER, CUST_FNAME, CUST_LNAME, CUST_INITIAL, CUST_AREACODE, CUST_PHONE, CUST_BALANCE, CUST_PASSWORD)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """,
            customer_data,
        )

        db.commit()
    except:
        raise HTTPException(status_code=500, detail="Failed to save customer")


@router.put("/update/{id}")
def update_customer(id: int, customer: CustomerUpdate, db=Depends(get_db)):
    customer_data = (
        customer.CUST_FNAME,
        customer.CUST_LNAME,
        customer.CUST_INITIAL,
        customer.CUST_AREACODE,
        customer.CUST_PHONE,
        customer.CUST_BALANCE,
        customer.CUST_PASSWORD,
    )

    cursor = db.cursor(dictionary=True)
    cursor.execute(
        """
        UPDATE CUSTOMER
        SET CUST_FNAME = %s, CUST_LNAME = %s, CUST_INITIAL = %s, CUST_AREACODE = %s, CUST_PHONE = %s, CUST_BALANCE = %s, CUST_PASSWORD = %s
        WHERE CUST_NUMBER = %s
        """,
        (*customer_data, id),
    )

    db.commit()


@router.delete("/delete/{customer_id}", status_code=204)
def delete_customer_by_id(customer_id: int, db=Depends(get_db)):
    cursor = db.cursor()

    # We need to delete the tables dependent on CUSTOMER

    # Delete lines
    cursor.execute(
        """
                   DELETE FROM LINE
                   WHERE INV_NUMBER IN
                   (SELECT INV_NUMBER FROM INVOICE WHERE CUST_NUMBER = %s)""",
        [customer_id],
    )

    # Delete invoices
    cursor.execute(
        """
                   DELETE FROM INVOICE WHERE CUST_NUMBER = %s""",
        [customer_id],
    )

    # Delete transactions
    cursor.execute(
        """
                   DELETE FROM ACCT_TRANSACTION WHERE CUST_NUMBER = %s""",
        [customer_id],
    )

    # Delete customers
    cursor.execute(
        """
                   DELETE FROM CUSTOMER WHERE CUST_NUMBER = %s""",
        [customer_id],
    )

    db.commit()
