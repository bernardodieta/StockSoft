from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.models.product import Product
from app.models.movement import StockMovement, MovementType
from app.schemas.movement import Movement as MovementSchema, MovementCreate

router = APIRouter()

@router.get("/", response_model=List[MovementSchema])
def read_movements(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve movements for the current company.
    """
    movements = db.query(StockMovement).filter(StockMovement.company_id == current_user.company_id).offset(skip).limit(limit).all()
    return movements

@router.post("/", response_model=MovementSchema)
def create_movement(
    *,
    db: Session = Depends(deps.get_db),
    movement_in: MovementCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Register new stock movement and update product stock.
    """
    product = db.query(Product).filter(
        Product.id == movement_in.product_id,
        Product.company_id == current_user.company_id
    ).first()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Calculate new stock
    if movement_in.type == MovementType.ENTRY:
        product.stock_actual += movement_in.quantity
    elif movement_in.type == MovementType.EXIT:
        if product.stock_actual < movement_in.quantity:
            raise HTTPException(status_code=400, detail="Insufficient stock")
        product.stock_actual -= movement_in.quantity
    elif movement_in.type == MovementType.ADJUSTMENT:
        product.stock_actual = movement_in.quantity # For adjustment, quantity is the new absolute stock? 
        # Actually, plan says "ajustes manuales". Usually adjustments can be relative or absolute.
        # Let's assume relative for now: product.stock_actual += movement_in.quantity (can be negative).
        # Wait, if I want to set it to 10, and it's 5, I adjust by +5.
        # I'll stick to relative for adjustment too, but allow negative values.
        product.stock_actual += movement_in.quantity
    
    movement = StockMovement(
        **movement_in.dict(),
        user_id=current_user.id,
        company_id=current_user.company_id
    )
    
    db.add(movement)
    db.add(product)
    db.commit()
    db.refresh(movement)
    return movement

@router.get("/product/{product_id}", response_model=List[MovementSchema])
def read_movements_by_product(
    *,
    db: Session = Depends(deps.get_db),
    product_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get movement history for a specific product.
    """
    # Verify product belongs to company
    product = db.query(Product).filter(Product.id == product_id, Product.company_id == current_user.company_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    movements = db.query(StockMovement).filter(
        StockMovement.product_id == product_id,
        StockMovement.company_id == current_user.company_id
    ).all()
    return movements
