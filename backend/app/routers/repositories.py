from fastapi import APIRouter, HTTPException, status
from ..models.models import ScanRequest, ScanResponse, ImplementationRequest, ImplementationResponse
from ..mock import external_server

router = APIRouter(
    prefix="/api/repositories",
    tags=["repositories"],
)

@router.post("/scan", response_model=ScanResponse)
async def scan_repository(scan_request: ScanRequest):
    """
    Initiate a scan of a GitHub repository to find good first issues.
    This endpoint sends the repository URL to the external server
    and returns a scan ID that can be used to check the status.
    """
    # Call the mock external server API
    result = external_server.start_scan(scan_request.repository_url)
    return result

@router.get("/scan/{scan_id}", response_model=ScanResponse)
async def get_scan_status(scan_id: str):
    """
    Check the status of a repository scan.
    Once the scan is completed, this will return a list of issues.
    """
    result = external_server.get_scan_status(scan_id)
    if result["status"] == "not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found"
        )
    return result

@router.post("/implement", response_model=ImplementationResponse)
async def implement_issue(implementation_request: ImplementationRequest):
    """
    Start the implementation of a selected issue.
    This endpoint sends the selected issue to the external server
    and returns an implementation ID that can be used to check the status.
    """
    result = external_server.start_implementation(
        implementation_request.scan_id,
        implementation_request.issue_id
    )
    if result.get("status") == "scan_not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found"
        )
    return result

@router.get("/implement/{implementation_id}", response_model=ImplementationResponse)
async def get_implementation_status(implementation_id: str):
    """
    Check the status of an issue implementation.
    Once the implementation is completed, this will return PR details.
    """
    result = external_server.get_implementation_status(implementation_id)
    if result["status"] == "not_found":
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Implementation not found"
        )
    return result 