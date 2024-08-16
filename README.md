# Chat App

This is a real-time chat application built using TypeScript, React, Socket.io, and Node.js. The app supports multiple users in various chat rooms, enabling them to send and receive messages instantly. It features a responsive design and reliable real-time communication, making it perfect for both desktop and mobile users.
## ✨ Features

- **💬 Real-Time Messaging**: Enjoy instant message delivery powered by Socket.io, ensuring a smooth communication flow.
- **👥 Group Chat**: Create and manage group chats with ease. The group creator is automatically assigned as the admin, capable of adding and removing users. Other members can add users but cannot remove them.
- **👀 User Presence**: Know when someone is typing, adding a layer of interactivity to your conversations.
- **📱 Responsive Design**: The user interface adapts seamlessly to different screen sizes, providing a consistent experience whether on desktop or mobile.
- **🔐 Secure Authentication**: Optionally integrate with Azure AD SAML for secure user authentication.
- **🎨 User-Friendly Interface**: Navigate effortlessly with an intuitive and clean design.

## 🛠 Technologies Used

- **Frontend**: TypeScript, React, CSS, Socket.io-client,ChakraUI,Redux toolkit
- **Backend**: TypeScript, Node.js, Express, Socket.io
- **Database**: MongoDB (user-provided)
- **Deployment**:

## 🚀 Getting Started

Follow these steps to set up and run the application on your local machine.

1. **Clone the Repository**:
```bash
git clone https://github.com/SaiVishnu97/chatappmern.git
```
2. **Install Dependencies for the frontend part**:
    ```bash
    cd chatappmern/frontend-typescript
    ```
   Create a .env file and add this env variable in that REACT_APP_BACKENDURL=http://localhost:5000
   ```bash
    npm install
    ```
3. **Run the Application**:
    ```bash
    npm start
    ```
4. **Install Dependencies for the backend**:
  The backend needs the MongoDB database which the user has to use on his own, however set these environment variables by create a .env file in the backend-typescript folder
  ```plaintext
  BACKEND_URL=http://localhost:5000
  MONGO_URI=''
  NODE_ENV=Production
  PORT=5000
  ```
    ```bash
    cd chatappmern/backend-typescript
    npm install
    ```
5. **Run the Application**:
    ```bash
    npm run start
    ```

6. **Open the App**: 
    Visit `http://localhost:3000` in your browser to start using the app.

