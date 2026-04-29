from fastapi import APIRouter, Depends, HTTPException

from app.database import get_db
from app.models import TransactionCreate, TransactionUpdate

router = APIRouter(prefix="/transactions")


@router.get("/all")
def get_all_transactions(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)

    query = "SELECT * FROM ACCT_TRANSACTION"
    cursor.execute(query)
    return cursor.fetchall()


@router.post("/save", status_code=201)
def save_transaction(transaction: TransactionCreate, db=Depends(get_db)):
    transaction_data = (
        transaction.ACCT_TRANS_NUM,
        transaction.ACCT_TRANS_DATE,
        transaction.CUST_NUMBER,
        transaction.ACCT_TRANS_TYPE,
        transaction.ACCT_TRANS_AMOUNT,
    )

    try:
        cursor = db.cursor()
        cursor.execute(
            """
            INSERT INTO ACCT_TRANSACTION
            (ACCT_TRANS_NUM, ACCT_TRANS_DATE, CUST_NUMBER, ACCT_TRANS_TYPE, ACCT_TRANS_AMOUNT)
            VALUES (%s, %s, %s, %s, %s)
            """,
            transaction_data,
        )

        db.commit()
    except:
        HTTPException(status_code=500, detail="Failed to save transaction")


@router.put("/update/{id}")
def update_transaction(id: int, transaction: TransactionUpdate, db=Depends(get_db)):
    transaction_data = (
        transaction.ACCT_TRANS_DATE,
        transaction.CUST_NUMBER,
        transaction.ACCT_TRANS_TYPE,
        transaction.ACCT_TRANS_AMOUNT,
    )
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute(
            """
            UPDATE ACCT_TRANSACTION
            SET ACCT_TRANS_DATE = %s, CUST_NUMBER = %s, ACCT_TRANS_TYPE = %s, ACCT_TRANS_AMOUNT = %s
            WHERE ACCT_TRANS_NUM = %s
            """,
            (*transaction_data, id),
        )
        db.commit()
    except:
        raise HTTPException(status_code=500, detail="Failed to update transaction")


@router.delete("/delete/{transaction_id}", status_code=204)
def delete_transaction_by_id(transaction_id: int, db=Depends(get_db)):
    cursor = db.cursor()

    cursor.execute(
        """
        DELETE FROM ACCT_TRANSACTION WHERE ACCT_TRANS_NUM = %s""",
        [transaction_id],
    )

    db.commit()
