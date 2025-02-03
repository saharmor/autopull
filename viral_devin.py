import requests
import os
from dotenv import load_dotenv

load_dotenv()
# Replace with your GitHub personal access token (PAT) if needed for private repos or rate limiting
# You can create a PAT here: https://github.com/settings/tokens
# Store it in an environment variable for security best practice
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")  # Optional: For authentication

def get_good_first_issues(repo_owner, repo_name):
    """
    Retrieves all open issues from a GitHub repository and prints those with the "good first issue" label.

    Args:
        repo_owner: The owner of the repository (e.g., "facebook").
        repo_name: The name of the repository (e.g., "react").

    Returns:
        A list of dictionaries, where each dictionary represents a "good first issue".
        Returns an empty list if no "good first issues" are found or if there's an error.
        Also prints informative messages to the console.
    """

    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues"
    headers = {}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"

    all_good_first_issues = []
    page = 1
    while True:
        params = {"state": "open", "page": page, "per_page": 100} # Increased per_page for efficiency
        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
            issues = response.json()

            if not issues:  # No more issues, break the loop
                break

            for issue in issues:
                labels = issue.get('labels', [])
                if any(label['name'].lower() == 'good first issue' for label in labels):
                    all_good_first_issues.append(issue)

            page += 1

        except requests.exceptions.RequestException as e:
            print(f"Error fetching issues: {e}")
            return [] # Return an empty list to indicate failure

    if not all_good_first_issues:
        print("No 'good first issues' found in this repository.")
    else:
        print(f"Found {len(all_good_first_issues)} 'good first issues' in this repository.")

    return all_good_first_issues


if __name__ == "__main__":
    repo_url = "https://github.com/OpenInterpreter/open-interpreter/"
    repo_owner = repo_url.split("/")[3]
    repo_name = repo_url.split("/")[4]

    good_first_issues = get_good_first_issues(repo_owner, repo_name)

    # print the the first three issues and their content
    for issue in good_first_issues[:3]:
        print(f"Issue #{issue['number']}: {issue['title']}")
        print(f"  URL: {issue['html_url']}")
        print(f"  Content: {issue['body']}")
        print("-" * 20 + "\n\n\n\n")

    # You can now do something with the list of good first issues, e.g., save it to a file
    # if good_first_issues:
    #     import json
    #     with open("good_first_issues.json", "w") as f:
    #         json.dump(good_first_issues, f, indent=4)