from pydantic import BaseModel, EmailStr

class User(BaseModel):
    username : str
    email: EmailStr
    password: str
    role: str = "user"


class CreateUser(BaseModel):
    username : str
    email: EmailStr
    password: str


class login(BaseModel):
    email : EmailStr
    password : str