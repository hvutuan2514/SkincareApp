To run the app, go to the directory of the app and run the command:
```bash
npm start
```

- need to add api keys to github --> admin settings (hannah)
```
Use GitHub's Secrets (For Private Repositories)
If you want to share the .env file securely with your contributor, consider using GitHub Secrets for private repositories:

Go to your GitHub repository.

Navigate to Settings > Secrets and Variables > Actions (for GitHub Actions) or Codespaces (for environment variables used in GitHub Codespaces).

Click on New repository secret.

Add each key-value pair from your .env file as a separate secret. For example:

Key: REACT_APP_API_KEY
Value: <your actual API key>
```
