from fastapi import APIRouter, Depends, HTTPException

from app.database import get_db
from app.models import VendorCreate, VendorUpdate

router = APIRouter(prefix="/vendors")


@router.get("/all")
def get_all_vendors(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)

    query = "SELECT * FROM VENDOR"
    cursor.execute(query)
    return cursor.fetchall()


@router.post("/save")
def save_vendor(vendor: VendorCreate, db=Depends(get_db)):
    vendor_data = (
        vendor.VEND_NUMBER,
        vendor.VEND_NAME,
        vendor.VEND_CONTACT,
        vendor.VEND_AREACODE,
        vendor.VEND_PHONE,
        vendor.VEND_STATE,
        vendor.VEND_ORDER,
    )
    try:
        cursor = db.cursor()
        cursor.execute(
            """
            INSERT INTO VENDOR
            (VEND_NUMBER, VEND_NAME, VEND_CONTACT, VEND_AREACODE, VEND_PHONE, VEND_STATE, VEND_ORDER)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            vendor_data,
        )

        db.commit()
    except:
        raise HTTPException(status_code=500, detail="Failed to save vendor")


@router.put("/update/{id}")
def update_vendor(id: int, vendor: VendorUpdate, db=Depends(get_db)):
    vendor_data = (
        vendor.VEND_NAME,
        vendor.VEND_CONTACT,
        vendor.VEND_AREACODE,
        vendor.VEND_PHONE,
        vendor.VEND_STATE,
        vendor.VEND_ORDER,
    )
    try:
        cursor = db.cursor(dictionary=True)
        cursor.execute(
            """
            UPDATE VENDOR
            SET VEND_NAME = %s, VEND_CONTACT = %s, VEND_AREACODE = %s, VEND_PHONE = %s, VEND_STATE = %s, VEND_ORDER = %s
            WHERE VEND_NUMBER = %s
            """,
            (*vendor_data, id),
        )
        db.commit()
    except:
        raise HTTPException(status_code=500, detail="Failed to update vendor")


@router.delete("/delete/{vendor_id}", status_code=204)
def delete_vendor_by_id(vendor_id: int, db=Depends(get_db)):
    cursor = db.cursor()

    cursor.execute(
        """
                   DELETE FROM LINE
                   WHERE PROD_CODE IN
                   (SELECT PROD_CODE FROM PRODUCT WHERE VEND_NUMBER = %s)""",
        [vendor_id],
    )
    cursor.execute("""DELETE FROM PRODUCT WHERE VEND_NUMBER = %s""", [vendor_id])
    cursor.execute("""DELETE FROM VENDOR WHERE VEND_NUMBER = %s""", [vendor_id])

    db.commit()
