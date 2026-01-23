# 🧾 LMInvoice – Sales and Product Management System

## 📋 Description

A web application for managing product billing, customers, and sales.  
It allows users to register products, issue invoices, calculate totals and taxes, and view sales reports.

---

## 🧠 Technologies Used

- **Backend:** Java, Spring Boot, Spring Data JPA, REST API, MySQL  
- **Frontend:** Angular, TypeScript, Bootstrap  
- **Others:** Postman, Git, Maven, IntelliJ / VS Code  

---

## ⚙️ Main Features

- 🔹 Product management (create, edit, delete)  
- 🔹 Customer management  
- 🔹 Invoice creation with automatic tax calculation  
- 🔹 Invoice listing and search  
- 🔹 REST API for external integration  
- 🔹 Basic authentication (optional: JWT or Spring Security)

---

## 📁 Project Structure

billing-app/
├── backend/ → Spring Boot REST API
├── frontend/ → Angular web interface
└── README.md

---

## 🧰 Installation and Usage

1. Clone the repository:
   bash
   git clone https://github.com/yourusername/billing-app.git

2. Configure the MySQL database (create schema `billing_db`)

3. Run the backend:
   bash
   cd backend
   mvn spring-boot:run

4. Run the frontend:
   bash
   cd frontend
   npm install
   ng serve

5. Open in the browser: [http://localhost:4200](http://localhost:4200)

---

## 📸 Screenshots

*(Add here some images of your frontend views, e.g., invoices, products, login)*

---

## 🚀 Project Status

Active development — upcoming features: authentication, PDF reports, Excel export, and user roles.

---

## 👨‍💻 Author

**Luis Martinez** – Fullstack Developer  
[LinkedIn](https://www.linkedin.com/in/luis-martinezo/) | [Email](mailto:lmartinezocoro@gmail.com)
