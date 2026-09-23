# COGNITO AI Readiness Framework - Web App (Modular Version)

A containerized web application for assessing AI readiness in electric utilities.

## Project Structure

```
cognito-app-modular/
├── app.py              # Flask web server (minimal)
├── requirements.txt    # Python dependencies
├── Dockerfile          # Container configuration
├── .dockerignore       # Files to exclude from container
└── static/
    ├── index.html      # Main HTML structure
    ├── css/
    │   └── styles.css  # All CSS styles
    └── js/
        └── app.js      # All JavaScript logic
```

## Changes from Original

This is a refactored version of the COGNITO application. The original monolithic `index.html` file (1.2MB) has been split into:

- **index.html** - Clean HTML structure only
- **css/styles.css** - All CSS styles extracted
- **js/app.js** - All JavaScript functionality extracted

The UI and functionality remain **100% identical** to the original version.

## Current Features

- ✅ Multi-step AI readiness assessment (Steps 1-5 + Summary)
- ✅ Auto-save to browser localStorage
- ✅ Export progress as JSON file
- ✅ Import previously saved JSON file
- ✅ PDF export functionality
- ✅ Works offline after initial load

## Benefits of Modular Structure

| Aspect | Before | After |
|--------|--------|-------|
| File Organization | 1 file (1.2MB) | 3 files |
| Maintainability | Hard to navigate | Easy to find code |
| Browser Caching | Entire file on change | CSS/JS cached separately |
| Team Collaboration | Merge conflicts | Work on separate files |
| Debugging | Line numbers hard to track | Clear file separation |

---

## Local Development

### Option 1: Run with Python directly

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
python app.py
```

Open: http://localhost:8000

### Option 2: Run with Docker locally

```bash
# Build the image
docker build -t cognito-app .

# Run the container
docker run -p 8000:8000 cognito-app
```

Open: http://localhost:8000

---

## Deploy to Azure

See original README for Azure deployment instructions - the deployment process is identical.

---

## Support

For questions about the COGNITO framework, refer to the COGNITO Framework Workbook documentation.
