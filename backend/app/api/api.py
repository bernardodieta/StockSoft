from fastapi import APIRouter

from app.api.endpoints import auth, users, companies, products, movements, suppliers, export

api_router = APIRouter()
api_router.include_router(auth.router, tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(movements.router, prefix="/movements", tags=["movements"])
api_router.include_router(suppliers.router, prefix="/suppliers", tags=["suppliers"])
api_router.include_router(export.router, prefix="/export", tags=["export"])
# api_router.include_router(companies.router, prefix="/companies", tags=["companies"])
