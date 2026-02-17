from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class CompanyBase(BaseModel):
    name: str
    address: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(CompanyBase):
    pass

class CompanyInDBBase(CompanyBase):
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Company(CompanyInDBBase):
    pass
