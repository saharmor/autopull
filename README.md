# viral-devin

## GitHub Issue Extractor

A Python script that extracts issues from a GitHub repository, saves them as JSON, and optionally gets recommendations for the best first issues using a language model.

### Features

- Extracts all open issues from a GitHub repository
- Includes all comments for each issue
- Formats data in a structured JSON format
- Optional LLM integration to recommend good first issues

### Installation

1. Clone this repository
2. Create a virtual environment and activate it:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```
3. Install required packages:
   ```
   pip install -r requirements.txt
   ```

### Environment Variables

Create a `.env` file in the project directory with:

```
GITHUB_TOKEN=your_github_token  # Optional, but recommended to avoid rate limits
OPENAI_API_KEY=your_openai_key  # Optional, for LLM recommendations
```

To create a GitHub personal access token, visit: https://github.com/settings/tokens

### Usage

#### Basic Usage

```bash
python extract_issues.py https://github.com/owner/repo
```

This will:
1. Extract all open issues from the repository
2. Save them to `issues.json` in the current directory
3. If an OpenAI API key is available, provide a recommendation for the best first issue

#### Additional Options

- Specify a custom output file:
  ```bash
  python extract_issues.py https://github.com/owner/repo --output custom_filename.json
  ```

- Skip the LLM recommendation:
  ```bash
  python extract_issues.py https://github.com/owner/repo --no-llm
  ```

### JSON Output Format

The generated JSON file has the following structure:

```json
[
  {
    "title": "Issue title",
    "number": 123,
    "url": "https://github.com/owner/repo/issues/123",
    "labels": ["bug", "good first issue"],
    "comments": [
      {
        "index": 0,
        "text": "Issue description text..."
      },
      {
        "index": 1,
        "text": "First comment text..."
      }
    ]
  }
]
```

### Requirements

- Python 3.6+
- requests
- python-dotenv
- OpenAI API key (optional, for LLM recommendations)

### License

See the LICENSE file for details.