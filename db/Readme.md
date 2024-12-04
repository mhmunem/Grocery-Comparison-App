# PostgreSQL Setup and Quick Reference Guide

This README provides detailed instructions for installing PostgreSQL, setting up roles and databases, and basic commands to get started.

## 1. Install PostgreSQL

### Windows
1. Download PostgreSQL from the [official website](https://www.postgresql.org/download/).
2. Run the installer and follow the instructions.
3. During installation, set up a PostgreSQL superuser (default is postgres) with a password.

## 2. Accessing PostgreSQL
After installation, access PostgreSQL using the psql CLI from installation folder
- enter  Server [localhost]:
            Database [postgres]:
            Port [5432]:
            Username [postgres]:
            Password for user postgres:

## 3. PostgreSQL Basics

### View Connection Information
```
\conninfo
```

### Quit the PostgreSQL Command Line
```
\q
```

## 4. Creating Roles and Setting Permissions

### Create a Role
```
CREATE ROLE admin WITH LOGIN PASSWORD 'admin';
```

### Grant Permissions to the Role
- Allow the role to create databases:
  ```
  ALTER ROLE admin CREATEDB;
  ```
- View the list of roles:
  ```
  \du
  ```
  Example Output:
  ```
                               List of roles
   Role name |                         Attributes
  --+
   admin     | Create DB
   postgres  | Superuser, Create role, Create DB, Replication, Bypass RLS
  ```


## 5. Creating and Connecting to a Database
### Create a Database
```
CREATE DATABASE api;
```

### Connect to the Database
```
\c api
```
- This switches to the api database and uses the admin user (if logged in as admin).

Example Output:
```
You are now connected to database "api" as user "admin".
```

## 6. Working with Tables
### List Tables in the Current Schema

```sql
\dt
```

## 7. Example Workflow
1. Access PostgreSQL as a superuser:
   ```
   psql -U postgres
   ```

2. Create a new role with login credentials:
   ```
   CREATE ROLE admin WITH LOGIN PASSWORD 'admin';
   ```

3. Grant the `CREATEDB` privilege to the `admin` role:
   ```
   ALTER ROLE admin CREATEDB;
   ```

4. Create a new database named `api`:
   ``
   CREATE DATABASE api;
   ```

5. Switch to the `api` database:
   ```
   \c api
   ```

6. Verify the connection:
   ```
   \conninfo
   ```

7. View tables in the current schema (if any):
   ```
   \dt
   ```
## 8. Additional Commands
### List All Schemas
```
\dn
```

### View Database Information
```
\l
```

### Delete a Role
```
DROP ROLE admin;
```

## 9. Common Troubleshooting
- Permission Denied: Check the role's permissions using `\du`.
