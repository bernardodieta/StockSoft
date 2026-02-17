from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.models.product import Product
from app.schemas.product import Product as ProductSchema, ProductCreate, ProductUpdate

router = APIRouter()

@router.get("/", response_model=List[ProductSchema])
def read_products(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve products for the current company.
    """
    products = db.query(Product).filter(Product.company_id == current_user.company_id).offset(skip).limit(limit).all()
    return products

@router.post("/", response_model=ProductSchema)
def create_product(
    *,
    db: Session = Depends(deps.get_db),
    product_in: ProductCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new product.
    """
    # Check if serial number exists in this company
    product = db.query(Product).filter(
        Product.company_id == current_user.company_id,
        Product.serial_number == product_in.serial_number
    ).first()
    if product:
        raise HTTPException(status_code=400, detail="Product with this serial number already exists in your company.")
    
    product = Product(
        **product_in.dict(),
        company_id=current_user.company_id
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.get("/{id}", response_model=ProductSchema)
def read_product(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get product by ID.
    """
    product = db.query(Product).filter(Product.id == id, Product.company_id == current_user.company_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{id}", response_model=ProductSchema)
def update_product(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    product_in: ProductUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a product.
    """
    product = db.query(Product).filter(Product.id == id, Product.company_id == current_user.company_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_in.dict(exclude_unset=True)
    for field in update_data:
        setattr(product, field, update_data[field])
    
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.delete("/{id}", response_model=ProductSchema)
def delete_product(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.check_role(["admin"])),
) -> Any:
    """
    Delete a product.
    """
    product = db.query(Product).filter(Product.id == id, Product.company_id == current_user.company_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return product
