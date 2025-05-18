import uuid
import time
import random
from typing import Dict, List, Any

# Mock issues for different repositories
MOCK_ISSUES = {
    "default": [
        {
            "id": 1,
            "title": "Fix typo in README",
            "description": "There's a typo in the README file that needs to be fixed.",
            "complexity": "Easy",
            "estimated_time": "5 minutes",
            "url": "https://github.com/user/repo/issues/1"
        },
        {
            "id": 2,
            "title": "Add missing import statement",
            "description": "The file src/utils.js is missing an import statement for the lodash library.",
            "complexity": "Easy",
            "estimated_time": "10 minutes",
            "url": "https://github.com/user/repo/issues/2"
        },
        {
            "id": 3,
            "title": "Fix CSS styling in navbar",
            "description": "The navbar has incorrect padding which causes it to look misaligned on mobile devices.",
            "complexity": "Medium",
            "estimated_time": "30 minutes",
            "url": "https://github.com/user/repo/issues/3"
        }
    ],
    "facebook/react": [
        {
            "id": 101,
            "title": "Fix documentation for useEffect",
            "description": "The documentation for useEffect hook has an incorrect example.",
            "complexity": "Easy",
            "estimated_time": "15 minutes",
            "url": "https://github.com/facebook/react/issues/101"
        },
        {
            "id": 102,
            "title": "Add type definitions for new API",
            "description": "The new API introduced in v18.0 is missing TypeScript type definitions.",
            "complexity": "Medium",
            "estimated_time": "45 minutes",
            "url": "https://github.com/facebook/react/issues/102"
        },
        {
            "id": 103,
            "title": "Fix performance regression in concurrent mode",
            "description": "There's a performance regression in concurrent mode when rendering large lists.",
            "complexity": "Hard",
            "estimated_time": "3 hours",
            "url": "https://github.com/facebook/react/issues/103"
        }
    ],
    "openai/openai-python": [
        {
            "id": 201,
            "title": "Add example for streaming API",
            "description": "The documentation is missing an example for using the streaming API.",
            "complexity": "Easy",
            "estimated_time": "20 minutes",
            "url": "https://github.com/openai/openai-python/issues/201"
        },
        {
            "id": 202,
            "title": "Fix error handling in async calls",
            "description": "Error handling in async calls doesn't correctly propagate error messages.",
            "complexity": "Medium",
            "estimated_time": "40 minutes",
            "url": "https://github.com/openai/openai-python/issues/202"
        },
        {
            "id": 203,
            "title": "Add retry mechanism for rate limits",
            "description": "The client should automatically retry requests when hitting rate limits.",
            "complexity": "Medium",
            "estimated_time": "1 hour",
            "url": "https://github.com/openai/openai-python/issues/203"
        }
    ]
}

# Mock PRs for implemented issues
MOCK_PRS = {
    1: {
        "id": 1001,
        "title": "Fix typo in README",
        "url": "https://github.com/user/repo/pull/1001",
        "status": "open"
    },
    2: {
        "id": 1002,
        "title": "Add missing import statement",
        "url": "https://github.com/user/repo/pull/1002",
        "status": "open"
    },
    3: {
        "id": 1003,
        "title": "Fix CSS styling in navbar",
        "url": "https://github.com/user/repo/pull/1003",
        "status": "open"
    },
    101: {
        "id": 2001,
        "title": "Fix documentation for useEffect",
        "url": "https://github.com/facebook/react/pull/2001",
        "status": "open"
    },
    102: {
        "id": 2002,
        "title": "Add type definitions for new API",
        "url": "https://github.com/facebook/react/pull/2002",
        "status": "open"
    },
    103: {
        "id": 2003,
        "title": "Fix performance regression in concurrent mode",
        "url": "https://github.com/facebook/react/pull/2003",
        "status": "open"
    },
    201: {
        "id": 3001,
        "title": "Add example for streaming API",
        "url": "https://github.com/openai/openai-python/pull/3001",
        "status": "open"
    },
    202: {
        "id": 3002,
        "title": "Fix error handling in async calls",
        "url": "https://github.com/openai/openai-python/pull/3002",
        "status": "open"
    },
    203: {
        "id": 3003,
        "title": "Add retry mechanism for rate limits",
        "url": "https://github.com/openai/openai-python/pull/3003",
        "status": "open"
    }
}

# Store active scans and implementations
active_scans: Dict[str, Dict[str, Any]] = {}
active_implementations: Dict[str, Dict[str, Any]] = {}

def extract_repo_info(repo_url: str) -> str:
    """Extract repository owner/name from URL."""
    parts = repo_url.strip('/').split('/')
    if 'github.com' in parts:
        owner_index = parts.index('github.com') + 1
        if len(parts) > owner_index + 1:
            return f"{parts[owner_index]}/{parts[owner_index + 1]}"
    return "default"

def start_scan(repo_url: str) -> Dict[str, Any]:
    """Start a mock scan of a repository."""
    scan_id = str(uuid.uuid4())
    repo_key = extract_repo_info(repo_url)
    
    active_scans[scan_id] = {
        "repo_url": repo_url,
        "repo_key": repo_key,
        "status": "in_progress",
        "start_time": time.time(),
        "issues": None
    }
    
    return {
        "scan_id": scan_id,
        "status": "in_progress"
    }

def get_scan_status(scan_id: str) -> Dict[str, Any]:
    """Get the status of a scan."""
    if scan_id not in active_scans:
        return {"status": "not_found"}
    
    scan = active_scans[scan_id]
    
    # Simulate scan completion after 5 seconds
    if scan["status"] == "in_progress" and time.time() - scan["start_time"] > 5:
        repo_key = scan["repo_key"]
        scan["status"] = "completed"
        scan["issues"] = MOCK_ISSUES.get(repo_key, MOCK_ISSUES["default"])
    
    return {
        "scan_id": scan_id,
        "status": scan["status"],
        "issues": scan["issues"] if scan["status"] == "completed" else None
    }

def start_implementation(scan_id: str, issue_id: int) -> Dict[str, Any]:
    """Start a mock implementation of an issue."""
    if scan_id not in active_scans:
        return {"status": "scan_not_found"}
    
    implementation_id = str(uuid.uuid4())
    
    active_implementations[implementation_id] = {
        "scan_id": scan_id,
        "issue_id": issue_id,
        "status": "in_progress",
        "start_time": time.time(),
        "pull_request": None
    }
    
    return {
        "implementation_id": implementation_id,
        "status": "in_progress"
    }

def get_implementation_status(implementation_id: str) -> Dict[str, Any]:
    """Get the status of an implementation."""
    if implementation_id not in active_implementations:
        return {"status": "not_found"}
    
    implementation = active_implementations[implementation_id]
    
    # Simulate implementation completion after 10 seconds
    if implementation["status"] == "in_progress" and time.time() - implementation["start_time"] > 10:
        implementation["status"] = "completed"
        implementation["pull_request"] = MOCK_PRS.get(implementation["issue_id"])
    
    return {
        "implementation_id": implementation_id,
        "status": implementation["status"],
        "pull_request": implementation["pull_request"] if implementation["status"] == "completed" else None
    } 