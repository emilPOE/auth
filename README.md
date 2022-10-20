# MySQL-auth-for-Node.js-with-Passport.js

Login/registration system for Node.js applications using the Express framework, MVC design pattern and Passport.js middleware.

## Getting Started

* Ensure Node.js & MySQL are installed and up to date

* Clone this repository to the desired directory

* Enter the directory

```
cd directorypath
```

* Install the required node modules

```
npm install
```

* Add database credentials to .env (dbname, dbusername, dbpassword)

* Add user table to database

```
CREATE TABLE `users` (
  `id` int(12) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Executing the Application

```
npm start
```

## Screenshots
<p align="center">Login Page</p>
<p align="center">
  <img width="460" height="300" src="/screenshots/login.png">
</p>
<p align="center">Registration Page</p>
<p align="center">
  <img width="460" height="300" src="/screenshots/registration.png">
</p>
<p align="center">Flash Error Messages</p>
<p align="center">
  <img width="460" height="300" src="/screenshots/flash.png">
</p>
<p align="center">Welcome Page</p>
<p align="center">
  <img width="460" height="300" src="/screenshots/welcome.png">
</p>
