# Laravel & React Project

This repository contains a project with **Laravel as the backend** and **React as the frontend** of **Tours and Travels Website**. It serves as a full-stack application with API-driven backend and dynamic frontend using React.

---

## 🛠️ Backend - Laravel

### ✅ Requirements

* PHP
* Composer
* MySQL or any supported database
* Node.js & NPM 

### 🚀 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name/backend
   ```

2. **Install PHP dependencies:**

   ```bash
   composer install
   ```

3. **Copy `.env` and generate the application key:**

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configure your `.env` file:**

   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=your_database
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

5. **Run migrations and seed the database:**

   ```bash
   php artisan migrate --seed
   ```

6. **Start the Laravel development server:**

   ```bash
   php artisan serve
   ```

---

## 💻 Frontend - React

### ✅ Requirements

* Node.js
* NPM

### 🚀 Installation

1. **Navigate to the frontend directory:**

   ```bash
   cd ../frontend
   ```

2. **Install JavaScript dependencies:**

   ```bash
   npm install

   ```

3. **Create a `.env` file and add the backend API URL:**

   ```env
   REACT_APP_API_URL=http://127.0.0.1:8001/api
   ```

4. **Start the React development server:**

   ```bash
   npm start

   ```

---

## 🔗 API Endpoints

All Laravel API routes are available at:

```
http://127.0.0.1:8001/api
```

You can manage:

* Users
* Bookings
* Contacts
* Enquiries
* Guides
* Tour Packages

---

