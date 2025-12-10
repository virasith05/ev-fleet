# EV Fleet — Full-Stack Application

This repository contains the complete EV Fleet system, including:

backend: Spring Boot API (runs on port 8181)  
frontend: React + Vite UI (runs on port 5173)

-----------------------------------------

## 1. Clone the Repository

git clone https://github.com/virasith05/ev-fleet.git  
cd ev-fleet

-----------------------------------------

## 2. Backend (Spring Boot — port 8181)

cd backend

### Build the backend

Windows:

.\mvnw.cmd clean package

Linux / Mac:

./mvnw clean package

### Start backend server

./mvnw spring-boot:run

Backend runs at:

http://localhost:8181

-----------------------------------------

### H2 Database Console

http://localhost:8181/h2-console

JDBC URL: jdbc:h2:mem:evfleetdb  
User: sa  
Password: *(leave empty)*

-----------------------------------------

## 3. Frontend (React + Vite — port 5173)

cd ../frontend

### Install dependencies

npm install

### Start frontend

npm run dev

Frontend runs at:

http://localhost:5173

-----------------------------------------

## 4. Configure Frontend API URL

Open file:

frontend/src/api/apiClient.ts

And set this:

export const BASE_URL = "http://localhost:8181";

-----------------------------------------

## 5. Run Full System

Start both:

Backend → http://localhost:8181  
Frontend → http://localhost:5173  

Then open in browser:

http://localhost:5173

Your EV Fleet Management System will be running successfully.

