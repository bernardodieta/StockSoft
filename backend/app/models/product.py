from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base_class import Base

class Product(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    serial_number = Column(String, index=True, nullable=False)
    stock_actual = Column(Float, default=0.0)
    min_stock = Column(Float, default=0.0)
    
    company_id = Column(Integer, ForeignKey("company.id"), nullable=False)
    company = relationship("Company")

    supplier_id = Column(Integer, ForeignKey("supplier.id"), nullable=True)
    supplier = relationship("Supplier")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Serial number must be unique WITHIN the company
    __table_args__ = (UniqueConstraint('serial_number', 'company_id', name='_serial_company_uc'),)
