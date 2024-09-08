# Contact Management App

## Description

The Contact Management App allows users to manage their contacts, including adding, editing, deleting, and viewing contact details. Users can register and log in to the app, as well as view and modify their contacts. The app uses an ASP.NET Core backend and a React frontend.

## Technologies

### Backend
- ASP.NET Core
- Entity Framework Core
- JWT (JSON Web Token) for authentication

### Frontend
- React
- Axios for API communication
- React Router for routing

## Installation

1. **Backend**

   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Restore NuGet packages:
     ```bash
     dotnet restore
     ```
   - Run the backend application:
     ```bash
     dotnet run
     ```

2. **Frontend**

   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Run the frontend application:
     ```bash
     npm start
     ```

## Project Structure

### Backend
- `Controllers/`: API controllers
- `Models/`: Data models
- `Data/`: Database context and migrations
- `Program.cs`: Application configuration

### Frontend
- `src/`
  - `components/`: React components (e.g., `Login.js`, `Register.js`, `ContactList.js`, `EditContact.js`, `Modal.js`, `Logout.js`)
  - `App.js`: Route configuration and main application component
  - `index.js`: Application entry point

## Features

- **Registration**: Allows users to create new accounts.
- **Login**: Allows users to log in and receive a JWT token.
- **Contact List**: Displays a list of contacts and allows viewing details.
- **Edit Contacts**: Allows editing contact details.
- **Delete Contacts**: Allows deleting contacts from the list.
- **Modal**: Displays contact details and allows editing and deleting contacts.

## API Endpoints

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: User login
- `GET /api/contacts`: Retrieve the list of contacts
- `GET /api/contacts/{id}`: Retrieve contact details
- `PUT /api/contacts/{id}`: Update a contact
- `DELETE /api/contacts/{id}`: Delete a contact

## Requirements

- Node.js (for the frontend)
- .NET Core SDK (for the backend)

## Usage

1. **Register** an account in the app to create a new user.
2. **Log in** to access contact management.
3. **Manage contacts**: Add, edit, and delete contacts.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions about the app, contact [Your Name] ([Your Email]).
