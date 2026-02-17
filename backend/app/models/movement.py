import enum
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base_class import Base

class MovementType(str, enum.Enum):
    ENTRY = "entry"
    EXIT = "exit"
    ADJUSTMENT = "adjustment"

class StockMovement(Base):
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("company.id"), nullable=False)
    
    quantity = Column(Float, nullable=False)
    type = Column(Enum(MovementType), nullable=False)
    description = Column(String, nullable=True)
    assignee = Column(String, nullable=True) # Name of the person the product was assigned to
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product")
    user = relationship("User")
    company = relationship("Company")
