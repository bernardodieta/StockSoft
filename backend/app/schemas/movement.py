from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from app.models.movement import MovementType

class MovementBase(BaseModel):
    product_id: int
    quantity: float
    type: MovementType
    description: Optional[str] = None
    assignee: Optional[str] = None

class MovementCreate(MovementBase):
    pass

class MovementInDBBase(MovementBase):
    id: int
    user_id: int
    company_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class Movement(MovementInDBBase):
    pass
