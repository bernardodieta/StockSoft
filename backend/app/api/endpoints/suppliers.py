from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.models.supplier import Supplier
from app.schemas.supplier import Supplier as SupplierSchema, SupplierCreate, SupplierUpdate

router = APIRouter()

@router.get("/", response_model=List[SupplierSchema])
def read_suppliers(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve suppliers for the current company.
    """
    suppliers = db.query(Supplier).filter(Supplier.company_id == current_user.company_id).offset(skip).limit(limit).all()
    return suppliers

@router.post("/", response_model=SupplierSchema)
def create_supplier(
    *,
    db: Session = Depends(deps.get_db),
    supplier_in: SupplierCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new supplier.
    """
    supplier = Supplier(
        **supplier_in.dict(),
        company_id=current_user.company_id
    )
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier

@router.get("/{id}", response_model=SupplierSchema)
def read_supplier(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get supplier by ID.
    """
    supplier = db.query(Supplier).filter(Supplier.id == id, Supplier.company_id == current_user.company_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return supplier

@router.put("/{id}", response_model=SupplierSchema)
def update_supplier(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    supplier_in: SupplierUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a supplier.
    """
    supplier = db.query(Supplier).filter(Supplier.id == id, Supplier.company_id == current_user.company_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    update_data = supplier_in.dict(exclude_unset=True)
    for field in update_data:
        setattr(supplier, field, update_data[field])
    
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return supplier

@router.delete("/{id}", response_model=SupplierSchema)
def delete_supplier(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.check_role(["admin"])),
) -> Any:
    """
    Delete a supplier.
    """
    supplier = db.query(Supplier).filter(Supplier.id == id, Supplier.company_id == current_user.company_id).first()
    if not supplier:
        raise HTTPException(status_code=404, detail="Supplier not found")
    db.delete(supplier)
    db.commit()
    return supplier
