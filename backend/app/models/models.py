from pydantic import BaseModel
from typing import List, Optional

class User(BaseModel):
    id: str
    github_username: str
    access_token: str

class Repository(BaseModel):
    owner: str
    name: str
    full_name: str
    url: str
    description: Optional[str] = None

class Issue(BaseModel):
    id: int
    title: str
    description: str
    complexity: str
    estimated_time: str
    url: str

class PullRequest(BaseModel):
    id: int
    title: str
    url: str
    status: str

class ScanRequest(BaseModel):
    repository_url: str

class ScanResponse(BaseModel):
    scan_id: str
    status: str
    issues: Optional[List[Issue]] = None

class ImplementationRequest(BaseModel):
    scan_id: str
    issue_id: int

class ImplementationResponse(BaseModel):
    implementation_id: str
    status: str
    pull_request: Optional[PullRequest] = None 