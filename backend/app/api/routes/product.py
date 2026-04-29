from fastapi import APIRouter, Depends, HTTPException

from app.database import get_db
from app.models import ProductCreate, ProductUpdate

router = APIRouter(prefix="/products")


@router.get("/all")
def get_all_products(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)

    query = "SELECT * FROM PRODUCT"
    cursor.execute(query)
    return cursor.fetchall()


@router.post("/save")
def save_product(product: ProductCreate, db=Depends(get_db)):
    product_data = (
        product.PROD_CODE,
        product.PROD_DESCRIPT,
        product.PROD_INDATE,
        product.PROD_QOH,
        product.PROD_MIN,
        product.PROD_PRICE,
        product.PROD_DISCOUNT,
        product.VEND_NUMBER,
    )

    try:
        cursor = db.cursor()
        cursor.execute(
            """
            INSERT INTO PRODUCT
            (PROD_CODE, PROD_DESCRIPT, PROD_INDATE, PROD_QOH, PROD_MIN, PROD_PRICE, PROD_DISCOUNT, VEND_NUMBER)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            product_data,
        )

        db.commit()
    except:
        raise HTTPException(status_code=500, detail="Failed to save product")


@router.put("/update/{id:path}")
def update_product(id: str, product: ProductUpdate, db=Depends(get_db)):
    product_data = (
        product.PROD_DESCRIPT,
        product.PROD_INDATE,
        product.PROD_QOH,
        product.PROD_MIN,
        product.PROD_PRICE,
        product.PROD_DISCOUNT,
        product.VEND_NUMBER,
    )
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute(
            """
            UPDATE PRODUCT
            SET PROD_DESCRIPT = %s, PROD_INDATE = %s, PROD_QOH = %s, PROD_MIN = %s, PROD_PRICE = %s, PROD_DISCOUNT = %s, VEND_NUMBER = %s
            WHERE PROD_CODE = %s
            """,
            (*product_data, id),
        )
        db.commit()
    except:
        raise HTTPException(status_code=500, detail="Failed to update product")


@router.delete("/delete/{product_id:path}", status_code=204)
def delete_product_by_id(product_id: str, db=Depends(get_db)):
    cursor = db.cursor()

    cursor.execute("""DELETE FROM LINE WHERE PROD_CODE = %s""", [product_id])

    cursor.execute(
        """
                   DELETE FROM PRODUCT WHERE PROD_CODE = %s""",
        [product_id],
    )

    db.commit()
