from fastapi import APIRouter, Depends, HTTPException

from app.database import get_db
from app.models import LineCreate, LineUpdate

router = APIRouter(prefix="/lines")


@router.get("/all")
def get_all_lines(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)

    query = "SELECT * FROM LINE"
    cursor.execute(query)
    return cursor.fetchall()


@router.post("/save")
def save_line(line: LineCreate, db=Depends(get_db)):
    line_data = (
        line.INV_NUMBER,
        line.LINE_NUMBER,
        line.PROD_CODE,
        line.LINE_UNITS,
        line.LINE_PRICE,
        line.LINE_AMOUNT,
    )

    try:
        cursor = db.cursor()
        cursor.execute(
            """
            INSERT INTO LINE
            (INV_NUMBER, LINE_NUMBER, PROD_CODE, LINE_UNITS, LINE_PRICE, LINE_AMOUNT)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            line_data,
        )

        db.commit()
    except:
        raise HTTPException(status_code=500, detail="Failed to save line")


@router.put("/update/{invoice_id}/{line_id}")
def update_line(invoice_id: int, line_id: int, line: LineUpdate, db=Depends(get_db)):
    line_data = (
        line.PROD_CODE,
        line.LINE_UNITS,
        line.LINE_PRICE,
        line.LINE_AMOUNT,
    )
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute(
            """
            UPDATE LINE
            SET PROD_CODE = %s, LINE_UNITS = %s, LINE_PRICE = %s, LINE_AMOUNT = %s
            WHERE INV_NUMBER = %s AND LINE_NUMBER = %s
            """,
            (*line_data, invoice_id, line_id),
        )
        db.commit()
    except:
        raise HTTPException(status_code=500, detail="Failed to update line")


@router.delete("/delete/{invoice_id}/{line_id}", status_code=204)
def delete_line_by_id(invoice_id: int, line_id: int, db=Depends(get_db)):
    cursor = db.cursor()

    cursor.execute(
        """
        DELETE FROM LINE WHERE INV_NUMBER = %s AND LINE_NUMBER = %s""",
        [invoice_id, line_id],
    )

    db.commit()
