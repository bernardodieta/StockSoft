from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    company_name: str
    email: EmailStr
    password: str
    full_name: str
