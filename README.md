# chris-estl-lab

Completed User Stories:

-   USER STORY 1: Upload Users (Prioritized)
-   USER STORY 2: Employee Dashboard Feature (Prioritized)
-   USER STORY 3: CRUD Feature (Bonus)
-   USER STORY 5: UI Localization (Bonus)

Running on local environment:

Tech Stack:

-   Angular
-   NestJS
-   MikroORM
-   MongoDB

Frontend

-   cd gui
-   npm install
-   ng serve

Backend

-   cd api
-   npm install
-   npm run start:dev

Access the application via deployed localhost:4200 server.

# Assumptions

For the filtering portion of User Story 2, I have implemented the backend API to do the sorting and filtering. However, on the frontend client I utilize the client to sort and paginate as I believe that it results in a better user experience. Filtering via the min/max salary will make a call to the backend, however sorting via table and switching pages do not request the API.
