from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    serial_number: str
    supplier_id: Optional[int] = None
    min_stock: Optional[float] = 0.0

class ProductCreate(ProductBase):
    stock_actual: Optional[float] = 0.0

class ProductUpdate(ProductBase):
    name: Optional[str] = None
    serial_number: Optional[str] = None
    min_stock: Optional[float] = None

class ProductInDBBase(ProductBase):
    id: int
    stock_actual: float
    company_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Product(ProductInDBBase):
    pass
