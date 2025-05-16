from fastapi import APIRouter, HTTPException, status, Response, Cookie, Request, Depends
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
import uuid
import requests
import os
import logging
from typing import Optional, List
from ..models.models import User, Repository

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get GitHub OAuth credentials from environment variables or use mock values for testing
GITHUB_CLIENT_ID = os.environ.get("GITHUB_CLIENT_ID", "mock_client_id")
GITHUB_CLIENT_SECRET = os.environ.get("GITHUB_CLIENT_SECRET", "mock_client_secret")
FRONTEND_URL = "http://localhost:5174"

# For mock mode, we'll use a flag to determine if we're using real GitHub API or mocks
USE_MOCK_GITHUB = not (os.environ.get("GITHUB_CLIENT_ID") and os.environ.get("GITHUB_CLIENT_SECRET"))

logger.info(f"GitHub OAuth mode: {'MOCK' if USE_MOCK_GITHUB else 'REAL'}")
logger.info(f"GitHub Client ID: {GITHUB_CLIENT_ID[:5]}... (truncated)")
logger.info(f"Frontend URL: {FRONTEND_URL}")

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
)

# Mock user database (in a real app, this would be in a database)
mock_users = {}

# Mock repositories for testing when not using real GitHub
MOCK_REPOSITORIES = [
    {
        "owner": {"login": "facebook"},
        "name": "react",
        "full_name": "facebook/react",
        "html_url": "https://github.com/facebook/react"
    },
    {
        "owner": {"login": "openai"},
        "name": "openai-python",
        "full_name": "openai/openai-python",
        "html_url": "https://github.com/openai/openai-python"
    },
    {
        "owner": {"login": "microsoft"},
        "name": "vscode",
        "full_name": "microsoft/vscode",
        "html_url": "https://github.com/microsoft/vscode"
    }
]

class GitHubAuthRequest(BaseModel):
    code: str

class UserResponse(BaseModel):
    id: str
    github_username: str
    avatar_url: Optional[str] = None

class RepositoryListResponse(BaseModel):
    repositories: List[Repository]

@router.get("/github")
async def github_auth_redirect():
    """
    Redirect to GitHub OAuth authorization page.
    """
    logger.info("GitHub auth redirect initiated")
    
    if USE_MOCK_GITHUB:
        # In mock mode, we'll just redirect back to the frontend with a mock user_id
        mock_user_id = str(uuid.uuid4())
        mock_users[mock_user_id] = {
            "id": mock_user_id,
            "github_username": f"mock_user_{mock_user_id[:8]}",
            "avatar_url": "https://avatars.githubusercontent.com/u/583231?v=4",
            "access_token": f"mock_token_{mock_user_id}"
        }
        logger.info(f"Mock authentication - redirecting with mock user ID: {mock_user_id[:8]}...")
        return RedirectResponse(f"{FRONTEND_URL}/auth-callback?user_id={mock_user_id}")
    
    # Standard OAuth flow with full repo access
    auth_url = f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&scope=repo"
    logger.info(f"Redirecting to GitHub OAuth: {auth_url}")
    return RedirectResponse(auth_url)

@router.get("/github/callback")
async def github_auth_callback(code: str = None):
    """
    Handle GitHub OAuth callback.
    This endpoint exchanges the code for a token and redirects back to the frontend.
    """
    logger.info(f"GitHub callback received")
    if code:
        logger.info(f"OAuth code received: {code[:5]}...")
    
    if USE_MOCK_GITHUB:
        # In mock mode, we shouldn't reach this endpoint, but just in case
        mock_user_id = str(uuid.uuid4())
        mock_users[mock_user_id] = {
            "id": mock_user_id,
            "github_username": f"mock_user_{mock_user_id[:8]}",
            "avatar_url": "https://avatars.githubusercontent.com/u/583231?v=4",
            "access_token": f"mock_token_{mock_user_id}"
        }
        logger.info(f"Mock authentication callback - redirecting with mock user ID: {mock_user_id[:8]}...")
        return RedirectResponse(f"{FRONTEND_URL}/auth-callback?user_id={mock_user_id}")
    
    # Handle OAuth flow
    if not code:
        logger.error("No code provided in callback")
        return RedirectResponse(f"{FRONTEND_URL}/login?error=missing_parameters")
        
    # Exchange code for access token
    token_url = "https://github.com/login/oauth/access_token"
    payload = {
        "client_id": GITHUB_CLIENT_ID,
        "client_secret": GITHUB_CLIENT_SECRET,
        "code": code
    }
    headers = {"Accept": "application/json"}
    
    try:
        logger.info("Exchanging code for access token...")
        response = requests.post(token_url, data=payload, headers=headers)
        response.raise_for_status()
        token_data = response.json()
        
        if "error" in token_data:
            logger.error(f"Error in token response: {token_data.get('error')}")
            return RedirectResponse(f"{FRONTEND_URL}/login?error={token_data['error']}")
        
        access_token = token_data["access_token"]
        logger.info(f"Access token obtained: {access_token[:5]}...")
        
        # Get user info from GitHub
        logger.info("Getting user info from GitHub...")
        github_user = get_github_user(access_token)
        
        # Generate a user ID
        user_id = str(uuid.uuid4())
        
        # Store the user
        mock_users[user_id] = {
            "id": user_id,
            "github_username": github_user["login"],
            "avatar_url": github_user.get("avatar_url"),
            "access_token": access_token
        }
        logger.info(f"User created with ID: {user_id[:8]}... GitHub username: {github_user['login']}")
        
        # Redirect to frontend with user_id as a query parameter
        redirect_url = f"{FRONTEND_URL}/auth-callback?user_id={user_id}"
        logger.info(f"Redirecting to: {redirect_url}")
        return RedirectResponse(redirect_url)
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Error exchanging GitHub code: {e}")
        return RedirectResponse(f"{FRONTEND_URL}/login?error=authentication_failed")

@router.post("/github-token", response_model=UserResponse)
async def set_github_token(auth_request: GitHubAuthRequest, response: Response):
    """
    Set the GitHub access token in a cookie.
    """
    if not auth_request.code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code is required"
        )
    
    try:
        # Verify user_id corresponds to a valid user
        if auth_request.code not in mock_users:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        user = mock_users[auth_request.code]
        
        # Set a cookie for session management
        response.set_cookie(
            key="user_id",
            value=user["id"],
            httponly=True,
            max_age=3600*24,  # 24 hours
            secure=False,  # Set to True in production with HTTPS
            samesite="lax"
        )
        
        return {
            "id": user["id"],
            "github_username": user["github_username"],
            "avatar_url": user.get("avatar_url")
        }
        
    except Exception as e:
        print(f"Error setting GitHub token: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error setting GitHub token"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user(user_id: Optional[str] = Cookie(None)):
    """
    Get the current authenticated user.
    """
    if not user_id or user_id not in mock_users:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    user = mock_users[user_id]
    return {
        "id": user["id"],
        "github_username": user["github_username"],
        "avatar_url": user.get("avatar_url")
    }

@router.post("/logout")
async def logout(response: Response, user_id: Optional[str] = Cookie(None)):
    """
    Log out the current user.
    """
    # Clear the cookie
    response.delete_cookie(key="user_id")
    
    # Remove user from mock database
    if user_id and user_id in mock_users:
        del mock_users[user_id]
    
    return {"message": "Logged out successfully"}

@router.get("/repositories", response_model=RepositoryListResponse)
async def get_user_repositories(user_id: Optional[str] = Cookie(None)):
    """
    Get repositories for the authenticated user.
    """
    if not user_id or user_id not in mock_users:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    user = mock_users[user_id]
    
    try:
        if USE_MOCK_GITHUB:
            # Use mock repositories for testing
            repos = MOCK_REPOSITORIES
        else:
            # Get real repositories from GitHub
            access_token = user["access_token"]
            repos = get_github_repositories(access_token)
        
        formatted_repos = [
            Repository(
                owner=repo["owner"]["login"],
                name=repo["name"],
                full_name=repo["full_name"],
                url=repo["html_url"]
            )
            for repo in repos
        ]
        
        return {"repositories": formatted_repos}
        
    except Exception as e:
        print(f"Error fetching repositories: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching repositories"
        )

def get_github_user(access_token: str):
    """
    Get user info from GitHub API.
    """
    headers = {
        "Authorization": f"token {access_token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    response = requests.get("https://api.github.com/user", headers=headers)
    response.raise_for_status()
    return response.json()

def get_github_repositories(access_token: str):
    """
    Get repositories for authenticated user from GitHub API.
    """
    headers = {
        "Authorization": f"token {access_token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    response = requests.get(
        "https://api.github.com/user/repos?sort=updated&per_page=100",
        headers=headers
    )
    response.raise_for_status()
    return response.json() 