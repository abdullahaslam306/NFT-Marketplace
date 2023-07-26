## Wallet Management Backend Services
This repository includes:
- Implementation of functions that are required for the serverless application

## Deployment
- This repository uses serverless framework which helps in deployment of APIs and lambda functions on AWS infrastructure.


## Local setup
- Following are prerequisite to locally setup this repository
    - Node 14.x
    - Postgresql 13.x
    - Run the migrations and setup database locally. For more detail, go through [migrations repository]
    - Globally install serverless
    ```
    npm install -g serverless
    ```
    - Set the following environment variables.
        - **BLOCOMMERCE_DB_HOSTNAME**, hostname of local database.
        - **BLOCOMMERCE_DB_NAME**, database name of local database.
        - **BLOCOMMERCE_DB_PASSWORD**, password of local database.
        - **BLOCOMMERCE_DB_PORT**, port of local database.
        - **BLOCOMMERCE_DB_USERNAME**, username of local database.
        - **BLOCOMMERCE_LOGGEDIN_USER_ID**, uid of user.
        - **BLOCOMMERCE_LOGGEDIN_MERCHANT_COGNITO_SID**, id of merchant from local database.

- Following steps are required to configure and run authbackend APIs and lambda functions on local machine:
    - Clone the git repository and switch to desired branch e.g. develop.
    ```
    git clone git@github.com:blocommerce/wallet-management.git
    git checkout develop
    ```
    - Run the following command to install packages and repositories mentioned in package.json 
    ```
    npm i
    ``` 
    - Navigate to **src** folder from cloned repository.
    ```
    cd src
    ```
    - Run the following command to deploy the APIs and lambda functions on localhost
    ```
    sls offline start --stage local
    ```
    - Access the APIs using tools like Postman while providing all the required parameters if any.
    - Example: To get workspace API endpoint will look something like 
    ```
    http://localhost:3003/api/v1
    ```
