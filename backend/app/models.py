from pydantic import BaseModel, constr, Field
from datetime import datetime


class CustomerCreate(BaseModel):
    CUST_NUMBER: int
    CUST_LNAME: str = constr(max_length=15)
    CUST_FNAME: str = constr(max_length=15)
    CUST_INITIAL: str = constr(max_length=1)
    CUST_AREACODE: str = constr(max_length=3)
    CUST_PHONE: str = constr(max_length=8)
    CUST_BALANCE: int = constr(max_length=8)
    CUST_PASSWORD: str = constr(max_length=32)


class CustomerUpdate(BaseModel):
    CUST_LNAME: str = constr(max_length=15)
    CUST_FNAME: str = constr(max_length=15)
    CUST_INITIAL: str = constr(max_length=1)
    CUST_AREACODE: str = constr(max_length=3)
    CUST_PHONE: str = constr(max_length=8)
    CUST_BALANCE: int = constr(max_length=8)
    CUST_PASSWORD: str = constr(max_length=32)


class VendorCreate(BaseModel):
    VEND_NUMBER: int
    VEND_NAME: str = constr(max_length=15)
    VEND_CONTACT: str = constr(max_length=50)
    VEND_AREACODE: str = constr(max_length=3)
    VEND_PHONE: str = constr(max_length=8)
    VEND_STATE: str = constr(max_length=2)
    VEND_ORDER: str = constr(max_length=1)


class VendorUpdate(BaseModel):
    VEND_NAME: str = constr(max_length=15)
    VEND_CONTACT: str = constr(max_length=50)
    VEND_AREACODE: str = constr(max_length=3)
    VEND_PHONE: str = constr(max_length=8)
    VEND_STATE: str = constr(max_length=2)
    VEND_ORDER: str = constr(max_length=1)


class ProductCreate(BaseModel):
    PROD_CODE: str = constr(max_length=10)
    PROD_DESCRIPT: str = constr(max_length=35)
    PROD_INDATE: datetime = Field(default_factory=datetime.utcnow())
    PROD_QOH: int
    PROD_MIN: int
    PROD_PRICE: float
    PROD_DISCOUNT: float
    VEND_NUMBER: int


class ProductUpdate(BaseModel):
    PROD_DESCRIPT: str = constr(max_length=35)
    PROD_INDATE: datetime = Field(default_factory=datetime.utcnow())
    PROD_QOH: int
    PROD_MIN: int
    PROD_PRICE: float
    PROD_DISCOUNT: float
    VEND_NUMBER: int


class LineCreate(BaseModel):
    INV_NUMBER: int
    LINE_NUMBER: int
    PROD_CODE: str = constr(max_length=10)
    LINE_UNITS: float
    LINE_PRICE: float
    LINE_AMOUNT: float


class LineUpdate(BaseModel):
    PROD_CODE: str = constr(max_length=10)
    LINE_UNITS: float
    LINE_PRICE: float
    LINE_AMOUNT: float


class InvoiceCreate(BaseModel):
    INV_NUMBER: int
    CUST_NUMBER: int
    INV_DATE: datetime = Field(default_factory=datetime.utcnow())
    INV_SUBTOTAL: float
    INV_TAX: float
    INV_TOTAL: float
    INV_PAY_TYPE: str = constr(max_length=5)
    INV_PAY_AMOUNT: float
    INV_BALANCE: float


class InvoiceUpdate(BaseModel):
    CUST_NUMBER: int
    INV_DATE: datetime = Field(default_factory=datetime.utcnow())
    INV_SUBTOTAL: float
    INV_TAX: float
    INV_TOTAL: float
    INV_PAY_TYPE: str = constr(max_length=5)
    INV_PAY_AMOUNT: float
    INV_BALANCE: float


class TransactionCreate(BaseModel):
    ACCT_TRANS_NUM: int
    ACCT_TRANS_DATE: datetime = Field(default_factory=datetime.utcnow())
    CUST_NUMBER: int
    ACCT_TRANS_TYPE: str = constr(max_length=8)
    ACCT_TRANS_AMOUNT: float


class TransactionUpdate(BaseModel):
    ACCT_TRANS_DATE: datetime = Field(default_factory=datetime.utcnow())
    CUST_NUMBER: int
    ACCT_TRANS_TYPE: str = constr(max_length=8)
    ACCT_TRANS_AMOUNT: float
