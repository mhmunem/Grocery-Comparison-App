# Express Server Setup

This README provides instructions for setting up, running, and managing your Express server.

## Prerequisites

Ensure you have the following installed:
- Node.js: [Download Node.js](https://nodejs.org/)
- npm: Comes with Node.js installation
- nodemon (optional): For automatic server restart on code changes
- install postman:[Download Postman](https://www.postman.com/downloads/) For API testing 

Verify the installation:
```
    - node -v
    - npm -v
    - nodeman
```

## Setup

1. Clone the repository 
   ```
   git clone -b <branch_name> <repon_name>

   ```
2.  Navigate to the project directory:
    ```
    cd backend
    ```
3. Install Express: (if not in `package.json` file)
   ```
   npm install express
   ```
4. Install Pg: (if not in `package.json` file)

    ```
    npm install pg / npm i pg

    ```
## Running the Server

To start the Express server:

1. Navigate to the project directory:
   ```
   cd my-express-app
   ```

2. Run the server: (file can index/app/main) check the package.json main field then use that name for file. 
   ```
   node <file.js>

   ```
   if the file name is server.js then run 
   ```
   node server.js

   ```

   You should see the some output in your terminal based on js file. For eg:
   ```
   Server is running on http://localhost:3000
   ```

3. Open a browser and navigate to `http://localhost:3000` to see the message.

## Using Nodemon (Optional)

To automatically restart the server whenever changes are made:

1. Install nodemon globally:
   ```
   npm install -g nodemon
   ```

2. Start the server using nodemon:
   ```
   nodemon 
   ```
   Nodemon will watch for changes in your files and restart the server automatically.

## Additional Notes

- To install packages and at the same time include that in package.json, use:
  ```
  npm install <package-name> --save
  ```

- To uninstall packages, use:
  ```
  npm uninstall <package-name>
  ```

## Coding Best Practices
[Express.js Coding Stadards](https://eng-git.canterbury.ac.nz/cosc680-2024/cosc680-2024-project/-/wikis/Coding-Style-Guidelines/Express.js-Coding-Standards-)
