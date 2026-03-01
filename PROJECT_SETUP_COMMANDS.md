# Product Management Project - Setup Commands for New Laptop

## Prerequisites Required on New Laptop:
- PHP 8.2 or higher
- Composer (PHP package manager)
- Node.js 18 or higher
- npm or yarn
- MySQL (or XAMPP/WAMP with MySQL)
- Git

---

## Step 1: Clone the Project
```bash
git clone <repository-url>
cd product_management
```

---

## Step 2: Backend Setup (Laravel)

### Navigate to backend folder:
```bash
cd backend
```

### Install PHP dependencies:
```bash
composer install
```

### Create .env file:
```bash
copy .env.example .env
```
(Windows CMD)

OR

```bash
cp .env.example .env
```
(Linux/Mac)

### Generate application key:
```bash
php artisan key:generate
```

### Configure MySQL Database:
Edit the `.env` file and set your database credentials:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=final_test
DB_USERNAME=root
DB_PASSWORD=
```

### Create the database in MySQL:
```bash
mysql -u root -p -e "CREATE DATABASE final_test;"
```

### Run migrations:
```bash
php artisan migrate
```

### Seed the database (optional - creates test users):
```bash
php artisan db:seed
```

---

## Step 3: Frontend Setup (React + Vite)

### Navigate to frontend folder:
```bash
cd ../frontend
```

### Install Node.js dependencies:
```bash
npm install
```

### Build the project:
```bash
npm run build
```

---

## Step 4: Running the Project

### Option A: Run Both Backend and Frontend Together

#### Terminal 1 - Start Laravel Backend:
```bash
cd backend
php artisan serve
```
This will start the backend at: http://localhost:8000

#### Terminal 2 - Start Frontend:
```bash
cd frontend
npm run dev
```
This will start the frontend at: http://localhost:5173

---

### Option B: Run Using Laravel Mix (Both together)
```bash
cd backend
npm run dev
```
This runs both frontend and backend together.

---

## Quick Setup Summary (One-time on new laptop):

```bash
# 1. Clone and enter project
git clone <repo-url>
cd product_management

# 2. Backend setup
cd backend
composer install
copy .env.example .env
php artisan key:generate
# (Create database 'final_test' in MySQL)
php artisan migrate

# 3. Frontend setup
cd ../frontend
npm install
npm run build

# 4. Run project
# Terminal 1:
cd backend && php artisan serve

# Terminal 2:
cd frontend && npm run dev
```

---

## Important Notes:

1. **MySQL Database**: Make sure MySQL is running and create a database named `final_test`

2. **Ports**: Ensure these ports are free:
   - 3306 (MySQL)
   - 8000 (Laravel)
   - 5173 (Vite/React)

3. **XAMPP Users**: If using XAMPP, make sure Apache and MySQL services are started

4. **First Time Login**: After seeding, you can login with:
   - Username: admin
   - Password: password

5. **API URL**: Frontend connects to backend at: http://localhost:8000/api
