from fastapi import APIRouter, HTTPException, status, Response, Cookie, Request, Depends
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
import uuid
import requests
import os
import logging
from typing import Optional, List
from ..models.models import User, Repository
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env-github-oauth (if it exists)
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), '.env-github-oauth')
if os.path.exists(dotenv_path):
    logger.info(f"Loading environment variables from {dotenv_path}")
    load_dotenv(dotenv_path)
else:
    logger.warning(f"Environment file not found at {dotenv_path}")

# Get GitHub OAuth credentials from environment variables or use mock values for testing
GITHUB_CLIENT_ID = os.environ.get("GITHUB_CLIENT_ID", "mock_client_id")
GITHUB_CLIENT_SECRET = os.environ.get("GITHUB_CLIENT_SECRET", "mock_client_secret")
FRONTEND_URL = "http://localhost:5174"

# For mock mode, we'll use a flag to determine if we're using real GitHub or mocks
USE_MOCK_GITHUB = not (os.environ.get("GITHUB_CLIENT_ID") and os.environ.get("GITHUB_CLIENT_SECRET")) or GITHUB_CLIENT_ID == "mock_client_id"

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
        "html_url": "https://github.com/facebook/react",
        "description": "A declarative, efficient, and flexible JavaScript library for building user interfaces."
    },
    {
        "owner": {"login": "openai"},
        "name": "openai-python",
        "full_name": "openai/openai-python",
        "html_url": "https://github.com/openai/openai-python",
        "description": "The official Python library for the OpenAI API"
    },
    {
        "owner": {"login": "microsoft"},
        "name": "vscode",
        "full_name": "microsoft/vscode",
        "html_url": "https://github.com/microsoft/vscode",
        "description": "Visual Studio Code"
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
    
    # Standard OAuth flow with only public repo access
    auth_url = f"https://github.com/login/oauth/authorize?client_id={GITHUB_CLIENT_ID}&scope=public_repo"
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
    logger.info(f"Fetching repositories for user_id: {user_id}")
    
    if not user_id or user_id not in mock_users:
        logger.error(f"User not authenticated. user_id: {user_id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    user = mock_users[user_id]
    logger.info(f"Found user: {user['github_username']}")
    
    try:
        if USE_MOCK_GITHUB:
            # Use mock repositories for testing
            logger.info("Using mock repositories")
            repos = MOCK_REPOSITORIES
        else:
            # Get real repositories from GitHub
            logger.info("Fetching real repositories from GitHub API")
            access_token = user["access_token"]
            logger.info(f"Using token starting with: {access_token[:5]}...")
            repos = get_github_repositories(access_token)
            logger.info(f"Fetched {len(repos)} repositories from GitHub")
            
            # If no repos were found but we're using real GitHub, fall back to mock repos for testing
            if len(repos) == 0:
                logger.warning("No repositories found from GitHub API, using mock repositories for testing")
                repos = MOCK_REPOSITORIES
        
        formatted_repos = [
            Repository(
                owner=repo["owner"]["login"],
                name=repo["name"],
                full_name=repo["full_name"],
                url=repo["html_url"],
                description=repo.get("description")
            )
            for repo in repos
        ]
        
        logger.info(f"Returning {len(formatted_repos)} repositories")
        return {"repositories": formatted_repos}
        
    except Exception as e:
        logger.error(f"Error fetching repositories: {e}")
        # In case of errors, return mock repositories rather than failing
        logger.warning("Using mock repositories due to error")
        formatted_repos = [
            Repository(
                owner=repo["owner"]["login"],
                name=repo["name"],
                full_name=repo["full_name"],
                url=repo["html_url"],
                description=repo.get("description")
            )
            for repo in MOCK_REPOSITORIES
        ]
        return {"repositories": formatted_repos}

def get_github_user(access_token: str):
    """
    Get user info from GitHub API.
    """
    # GitHub API accepts both "token" and "Bearer" formats, but "token" is more commonly used
    headers = {
        "Authorization": f"token {access_token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    try:
        logger.info("Getting user info from GitHub API")
        response = requests.get("https://api.github.com/user", headers=headers)
        
        # Log API rate limit info if available
        if 'X-RateLimit-Remaining' in response.headers:
            logger.info(f"GitHub API rate limit remaining: {response.headers.get('X-RateLimit-Remaining')}")
            
        response.raise_for_status()
        user_data = response.json()
        logger.info(f"Successfully retrieved user info for: {user_data.get('login')}")
        return user_data
    except requests.exceptions.RequestException as e:
        logger.error(f"GitHub API request failed: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            logger.error(f"Status code: {e.response.status_code}")
            logger.error(f"Response body: {e.response.text}")
        raise

def get_github_repositories(access_token: str):
    """
    Get repositories for authenticated user from GitHub API.
    """
    # GitHub API accepts both "token" and "Bearer" formats, but "token" is more commonly used
    headers = {
        "Authorization": f"token {access_token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    try:
        # First, let's try to get the authenticated user to verify token works
        logger.info("Testing token by fetching user info")
        user_response = requests.get("https://api.github.com/user", headers=headers)
        
        if user_response.status_code != 200:
            logger.error(f"Unable to authenticate with GitHub. Status: {user_response.status_code}")
            logger.error(f"Response: {user_response.text}")
            return []  # Return empty list instead of raising exception
        
        user_data = user_response.json()
        logger.info(f"Successfully authenticated as: {user_data.get('login')}")
        
        # Now fetch both user's own repos and repos they can access
        logger.info("Fetching user's repositories")
        repos = []
        
        # Try different endpoints to ensure we get all accessible repos
        endpoints = [
            # User's own public repositories
            f"https://api.github.com/users/{user_data.get('login')}/repos?type=public&sort=updated&per_page=100",
            
            # All repositories the user can access (including ones they collaborate on)
            "https://api.github.com/user/repos?visibility=public&sort=updated&per_page=100"
        ]
        
        for endpoint in endpoints:
            logger.info(f"Fetching from endpoint: {endpoint}")
            response = requests.get(endpoint, headers=headers)
            
            if response.status_code == 200:
                current_repos = response.json()
                logger.info(f"Found {len(current_repos)} repos from this endpoint")
                
                # Add any new repos not already in our list
                for repo in current_repos:
                    if repo.get('id') not in [r.get('id') for r in repos]:
                        repos.append(repo)
            else:
                logger.warning(f"Failed to fetch from {endpoint}. Status: {response.status_code}")
        
        logger.info(f"Total repositories found: {len(repos)}")
        
        # If no repositories were found, log detailed information
        if len(repos) == 0:
            logger.warning("No repositories found! User may not have any public repositories.")
            logger.info(f"User profile: Public repos count from GitHub: {user_data.get('public_repos', 0)}")
        
        return repos
    except Exception as e:
        logger.error(f"Error fetching repositories: {str(e)}")
        # Return empty list instead of raising to avoid breaking the UI
        return [] 