# MERN - Truest Estate

## Overview

*Truest Estate* is a sophisticated real estate application built on the MERN stack, featuring a modern and intuitive user interface. Designed to streamline the process of listing properties for rent or sale, it offers seamless account creation and secure login through Google OAuth. Users can showcase their properties with detailed descriptions and high-resolution images, providing a captivating experience for potential renters or buyers.

## Technologies Used

- React.js
- MongoDB
- Express
- Node.js
- Firebase
- OAuth
- Postman
- Vite
- Bcrypt.js
- TypeScript
- Redux
- Google OAuth
- Render

## Objectives

- [x] Implement basic back-end functionality
- [x] Develop basic client interface
- [x] Enable users to sign up, sign in, and sign out
- [x] Integrate *Google OAuth* for secure authentication
- [x] Design and implement complete user profile page UI
- [x] Enable users to upload images for their profiles
- [x] Allow users to update and delete their accounts
- [x] Implement functionality for users to create property listings
- [x] Enable image uploads for property listings
- [x] Allow users to update existing property listings
- [x] Implement functionality for users to delete property listings
- [x] Add "Contact Landlord" feature
- [x] Integrate "Search Listings" functionality
- [x] Finalize UI enhancements
- [x] Conduct thorough testing
- [x] Deploy the application

## Routes Table

### Auth

| **URL**           | **HTTP Verb** | **Action** |
| ----------------- | ------------- | ---------- |
| /api/auth/sign-up | POST          | create     |
| /api/auth/sign-in | POST          | create     |
| /api/auth/google  | POST          | create     |
| /api/auth/signout | DELETE        | destroy    |
### User

| **URL**              | **HTTP Verb** | **Action** |
| -------------------- | ------------- | ---------- |
| /api/user/update/:id | POST          | update     |
| /api/user/delete/:id | DELETE        | destroy     |
| /api/user/listings/:id | GET           | index |
| /api/user/:id       | GET           | show     |

### Listing

| **URL**              | **HTTP Verb** | **Action** |
| -------------------- | ------------- | ---------- |
| /api/listing/create  | POST          | create     |
| /api/listing/delete/:id | DELETE        | destroy    |
| /api/listing/update/:id | POST          | update     |
| /api/listing/get/:id | GET          | show       |
| /api/listing/get     | GET          | index      |
