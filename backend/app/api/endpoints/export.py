import csv
import io
from typing import Any, List
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.api import deps
from app.models.user import User
from app.models.product import Product
from app.models.movement import StockMovement

router = APIRouter()

@router.get("/products")
def export_products_csv(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Export products to CSV.
    """
    products = db.query(Product).filter(Product.company_id == current_user.company_id).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Nombre", "Numero de Serie", "Stock Actual", "Stock Minimo", "Descripcion"])
    
    for p in products:
        writer.writerow([p.id, p.name, p.serial_number, p.stock_actual, p.min_stock, p.description])
    
    content = output.getvalue()
    return Response(
        content=content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=productos.csv"}
    )

@router.get("/movements")
def export_movements_csv(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Export movements to CSV.
    """
    movements = db.query(StockMovement).filter(StockMovement.company_id == current_user.company_id).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Fecha", "Producto ID", "Tipo", "Cantidad", "Asignado a", "Descripcion"])
    
    for m in movements:
        writer.writerow([m.id, m.created_at.strftime("%Y-%m-%d"), m.product_id, m.type, m.quantity, m.assignee, m.description])
    
    content = output.getvalue()
    return Response(
        content=content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=movimientos.csv"}
    )
