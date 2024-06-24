# HiveHub

# Group Task Management Mobile Application

A mobile application for managing group tasks, built with Spring Boot, React Native (Expo), MySQL, and a socket server for real-time chat.


## Features

- Task management: create, update, delete, assign tasks
- Real-time chat
- Task history tracking

## Tech Stack

**Frontend:** React Native (Expo)

**Backend:** Spring Boot

**Database:** MySQL

**Real-time:** Socket Server


## Installation
### Backend
1 Clone the repository:

```bash
git clone https://github.com/luana2322/HiveHub.git
```
 2 Configure application.properties in backend directory:

```bash
spring.datasource.url=jdbc:mysql://localhost:3306/your-database-name
spring.datasource.username=your-username
spring.datasource.password=your-password
spring.jpa.hibernate.ddl-auto=update
```
 3 Build and run the backend:

```bash
cd backend
./mvnw spring-boot:run
```
### Frontend
1 Install dependencies and start Expo:

```bash
cd ../frontend
npm install
npx expo start
```
<p align="left">
</p>

<h3 align="left">Languages and Tools:</h3>
<p align="left"> <a href="https://developer.android.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/android/android-original-wordmark.svg" alt="android" width="40" height="40"/> </a> <a href="https://www.java.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg" alt="java" width="40" height="40"/> </a> <a href="https://www.mysql.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" alt="mysql" width="40" height="40"/> </a> <a href="https://reactnative.dev/" target="_blank" rel="noreferrer"> <img src="https://reactnative.dev/img/header_logo.svg" alt="reactnative" width="40" height="40"/> </a> <a href="https://spring.io/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/springio/springio-icon.svg" alt="spring" width="40" height="40"/> </a> </p>
>>>>>>> Stashed changes
