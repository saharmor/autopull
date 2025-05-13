import requests
import os
import json
import argparse
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get GitHub token from environment variables
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
# Get OpenAI API key from environment variables
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

def parse_github_url(url):
    """Parse a GitHub URL to get owner and repo name."""
    parts = url.strip('/').split('/')
    if 'github.com' not in parts:
        raise ValueError("Not a valid GitHub URL")
    
    try:
        owner_index = parts.index('github.com') + 1
        owner = parts[owner_index]
        repo = parts[owner_index + 1]
        return owner, repo
    except (ValueError, IndexError):
        raise ValueError("Could not parse GitHub URL. Format should be: https://github.com/{owner}/{repo}")

def get_all_issues(repo_owner, repo_name):
    """Get all open issues from a GitHub repository."""
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues"
    headers = {"Accept": "application/vnd.github.v3+json"}
    
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    
    all_issues = []
    page = 1
    
    while True:
        params = {"state": "open", "page": page, "per_page": 100}
        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            issues = response.json()
            
            if not issues:  # No more issues, break the loop
                break
            
            all_issues.extend(issues)
            page += 1
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching issues: {e}", file=sys.stderr)
            sys.exit(1)
    
    return all_issues

def get_issue_comments(repo_owner, repo_name, issue_number):
    """Get all comments for a specific issue."""
    url = f"https://api.github.com/repos/{repo_owner}/{repo_name}/issues/{issue_number}/comments"
    headers = {"Accept": "application/vnd.github.v3+json"}
    
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    
    all_comments = []
    page = 1
    
    while True:
        params = {"page": page, "per_page": 100}
        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            comments = response.json()
            
            if not comments:  # No more comments, break the loop
                break
            
            all_comments.extend(comments)
            page += 1
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching comments for issue #{issue_number}: {e}", file=sys.stderr)
            return []
    
    return all_comments

def format_issue_data(issues, repo_owner, repo_name):
    """Format issues and their comments into the desired structure."""
    formatted_issues = []
    
    for i, issue in enumerate(issues):
        # Get comments for this issue
        comments = get_issue_comments(repo_owner, repo_name, issue['number'])
        
        # Extract label names
        labels = [label['name'] for label in issue.get('labels', [])]
        
        # Format comments
        formatted_comments = []
        # Add the issue body as the first comment (index 0)
        formatted_comments.append({
            "index": 0,
            "text": issue['body'] or ""
        })
        
        # Add the rest of the comments
        for j, comment in enumerate(comments):
            formatted_comments.append({
                "index": j + 1,  # Start from 1 since the issue body is index 0
                "text": comment['body']
            })
        
        # Create the formatted issue
        formatted_issue = {
            "title": issue['title'],
            "number": issue['number'],
            "url": issue['html_url'],
            "labels": labels,
            "comments": formatted_comments
        }
        
        formatted_issues.append(formatted_issue)
        
        # Print progress update
        print(f"Processed issue {i+1}/{len(issues)}: #{issue['number']}", file=sys.stderr)
    
    return formatted_issues

def get_llm_recommendation(issues_data, repo_owner, repo_name):
    """
    Send the issues data to the OpenAI API and return the recommendation.
    """
    if not OPENAI_API_KEY:
        print("Warning: OPENAI_API_KEY not found in environment variables.", file=sys.stderr)
        print("To get recommendations, set the OPENAI_API_KEY or pass the generated issues.json file to your preferred LLM with this prompt:", file=sys.stderr)
        print("\nGiven the following list of GitHub issues and their full discussions, what is the best first issue")
        print("for someone who wants to contribute to this repository? Please consider clarity, complexity, and")
        print("whether the issue seems well-scoped for a newcomer. Return your recommendation along with a short explanation.\n")
        return None
    
    try:
        # Prepare a simplified version of the issues data to avoid token limits
        simplified_issues = []
        for issue in issues_data:
            simplified_issue = {
                "title": issue['title'],
                "number": issue['number'],
                "url": issue['url'],
                "labels": issue['labels'],
                "comments": [
                    {
                        "index": comment['index'],
                        "text": comment['text'][:500] + ("..." if len(comment['text']) > 500 else "")
                    }
                    for comment in issue['comments']
                ]
            }
            simplified_issues.append(simplified_issue)
        
        # Create the prompt for the LLM
        prompt = f"""Given the following list of GitHub issues and their full discussions from the repository {repo_owner}/{repo_name}, 
what is the best first issue for someone who wants to contribute to this repository? 
Please consider clarity, complexity, and whether the issue seems well-scoped for a newcomer.
Return your recommendation along with a short explanation.

Issues:
{json.dumps(simplified_issues, indent=2)}
"""
        
        # Call the OpenAI API
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENAI_API_KEY}"
        }
        data = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": "You are a helpful assistant that analyzes GitHub issues to find the best first issues for newcomers."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.5,
            "max_tokens": 500
        }
        
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        
        result = response.json()
        recommendation = result['choices'][0]['message']['content']
        
        print("\nLLM Recommendation:")
        print("===================")
        print(recommendation)
        
        return recommendation
        
    except requests.exceptions.RequestException as e:
        print(f"Error calling OpenAI API: {e}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"Error processing LLM recommendation: {e}", file=sys.stderr)
        return None

def main():
    parser = argparse.ArgumentParser(description='Extract issues from a GitHub repository and get LLM recommendations.')
    parser.add_argument('repo_url', nargs='?', default='https://github.com/saharmor/cursor-view', 
                        help='GitHub repository URL, e.g., https://github.com/owner/repo (default: https://github.com/saharmor/cursor-view)')
    parser.add_argument('--output', '-o', default='issues.json', help='Output JSON file path (default: issues.json)')
    parser.add_argument('--no-llm', action='store_true', help='Skip LLM recommendation')
    args = parser.parse_args()
    
    try:
        repo_owner, repo_name = parse_github_url(args.repo_url)
        print(f"Extracting issues from {repo_owner}/{repo_name}...", file=sys.stderr)
        
        # Get all issues
        issues = get_all_issues(repo_owner, repo_name)
        print(f"Found {len(issues)} open issues.", file=sys.stderr)
        
        # Format the issues data
        formatted_issues = format_issue_data(issues, repo_owner, repo_name)
        
        # Write to JSON file
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(formatted_issues, f, indent=2, ensure_ascii=False)
        
        print(f"\nIssues data saved to {args.output}", file=sys.stderr)
        
        # Get LLM recommendation if not disabled
        if not args.no_llm:
            get_llm_recommendation(formatted_issues, repo_owner, repo_name)
        
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main() 