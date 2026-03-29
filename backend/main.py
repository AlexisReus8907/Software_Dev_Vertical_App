from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import requests
import os
from dotenv import load_dotenv
from database import supabase

load_dotenv()
app = FastAPI(title="AI News API")
news_api_key = os.getenv("news_api_key")
gemini_api_key = os.getenv("gemini_api_key")

from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Website URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],    
)

class ArticleRequest(BaseModel):
    article_text: str

class UserAuth(BaseModel):
    email: str
    password: str

class FavoriteArticle(BaseModel):
    title: str
    summary: str
    url: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI & Software Guild Backend!"}

# News Api integration
@app.get("/api/news")
def get_news(search_term: str = "technology"):
    """Fetches latest news based on any keyword search."""
    if not news_api_key:
         raise HTTPException(status_code=500, detail="News API key not found") 
    url = f"https://newsapi.org/v2/everything?q={search_term}&language=en&sortBy=publishedAt&apiKey={news_api_key}"
    response = requests.get(url)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to fetch news")
    return response.json()

# Summary Ai api integration
@app.post("/api/summarize")
def summarize_article(request: ArticleRequest):
    """Takes article text and returns a strict 2-sentence AI summary."""
    if not gemini_api_key:
         raise HTTPException(status_code=500, detail="Gemini API key not found. Check your .env file!")      
    prompt = f"Read the following news article and summarize it in exactly two concise sentences. Do not add any introductory or concluding remarks.\n\nArticle Text:\n{request.article_text}"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}]
    }
    response = requests.post(url, json=payload)
    response_data = response.json()
    
    # Debugging
    if response.status_code != 200 or "error" in response_data:
        raise HTTPException(status_code=500, detail=f"GOOGLE API ERROR: {response_data}") 
    try:
        summary = response_data['candidates'][0]['content']['parts'][0]['text']
        return {"summary": summary.strip()}  
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parsing failed. Raw data from Google: {response_data}")

# User login
@app.post("/api/signup")
def signup(user: UserAuth):
    """Register a new user in Supabase"""
    try:
        response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
        })
        return {"message": "Success! Check your email for confirmation.", "user": response.user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/login")
def login(user: UserAuth):
    """Login and get a session token"""
    try:
        response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password,
        })
        return {
            "message": "Login successful",
            "access_token": response.session.access_token,
            "user": response.user
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid login credentials")
    
def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No authorization header found")
    token = authorization.replace("Bearer ", "")
    
    try:
        user = supabase.auth.get_user(token)
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired session")

security = HTTPBearer()
def get_current_user(auth: HTTPAuthorizationCredentials = Depends(security)):
    token = auth.credentials
    try:
        user = supabase.auth.get_user(token)
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid session")
    
@app.get("/api/me")
def get_my_profile(user=Depends(get_current_user)):
    """A private route that only returns data for the logged-in user."""
    return {
        "message": "This is your private session!",
        "user_email": user.user.email,
        "user_id": user.user.id
    }

# Sql Integration
@app.post("/api/favorites")
def save_favorite(article: FavoriteArticle, user=Depends(get_current_user)):
    """Saves a summary to the user's private database table."""
    try:
        data = {
            "user_id": user.user.id,
            "title": article.title,
            "summary": article.summary,
            "url": article.url
        }
        response = supabase.table("favorites").insert(data).execute()
        return {"message": "Article saved to favorites!", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/favorites")
def get_favorites(user=Depends(get_current_user)):
    """Fetches all favorites for the logged-in user."""
    try:
        # RLS in Supabase handles the filtering, but we'll be explicit
        response = supabase.table("favorites").select("*").eq("user_id", user.user.id).execute()
        return {"favorites": response.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))