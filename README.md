# Grocery Comparison App

## Overview

We will develop a grocery price comparison app to help users find the best prices for their grocery items across multiple supermarkets.

## Folder Structure

- `frontend/`: Mobile application using React and Ionic.
- `backend/`: API and server-side logic with Express.js.
- `db/`: PostgreSQL database schema and scripts.
- `webscraping/`: Crawlee-based web scraping scripts to fetch grocery data.

## Tech Stack

- **Frontend**: React, Ionic, Capacitor
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Web Scraping**: Crawlee

## Getting Started

Follow the instructions in the individual folder README files for setup.

- `frontend/`:[Frontend Readme](frontend\README.md)
- `backend/`:[Backend Readme](backend\Readme.md)
- `db/`: [Database Readme](db\Readme.md)
- `webscraping/`:[WebScraping Readme](webscraping\README.md)


## Development Team

- Team Members: Anne-Jan Veendijk, Haosheng Ye, Mohammad Munem, Nandhini Sambasivam, Sam Williams, Yuchuan Jin
- Development Timeline: December 2, 2024 - February 7, 2025

## Prerequisites

### Node.js and npm Installation

1. Download:
   - Download the latest **LTS version** of Node.js from the [Node.js official website](https://nodejs.org/). This installation includes npm.
   - Alternatively, follow detailed instructions for your OS from [this guide](https://kinsta.com/blog/how-to-install-node-js/).

2. Verify Installation:
   Run the following commands to confirm installation:
   ```
   node -v
   npm -v
   ```
#### Troubleshooting
##### If node or npm Is Not Recognized

1. **Check PATH Variable**:
   Ensure that node and npm are added to your system's PATH.

   - Windows:
     - Open System Properties > Environment Variables.
     - Locate the Path variable in System Variables and ensure it includes the directory where Node.js was installed (C:\Program Files\nodejs\).
2. **Other issue check here** (https://medium.com/@ruben.alapont/troubleshooting-common-npm-issues-tips-and-solutions-c6d0cd094d56)

### Code Editor of your Choice
- The Ionic React documentation recommends using Visual Studio Code (VS Code) as the IDE for development (https://ionicframework.com/docs/intro/environment) 


## Git Workflow

Check the Git Cheat sheet for the Git workflow [here](https://about.gitlab.com/images/press/git-cheat-sheet.pdf).

### Clone the Repository

Clone the project to your local machine:
```
git clone https://eng-git.canterbury.ac.nz/cosc680-2024/cosc680-2024-project.git
cd cosc680-2024-project
```

### Create and Switch to a New Branch

```
git checkout -b <branch-name>
```
Use descriptive branch names, such as `feature/<feature_name>` or `bug/<bug_name>`.

### Stage and Commit Changes

1. Stage your changes:
   ```
   git add .
   ```
   - To stage specific files:
     ```
     git add <file-name>
     ```

2. Commit your changes with a message:
   ```
   git commit -m "Descriptive commit message"
   ```

### Push Changes

```
git push origin <branch-name>
```