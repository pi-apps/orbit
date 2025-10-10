# Orbit - AI-Powered Social Media Management

Orbit is an AI-powered social media management platform designed to help users create engaging content, automate their social media presence, and grow their audience. This repository contains the open-source frontend application.

## Key Features

- **Link Multiple Social Media Accounts:** Connect and manage multiple social media profiles from a single dashboard.
- **One-Click Posting:** Instantly share your content across all linked accounts with a single click.
- **AI-Powered Content Creation:** Generate high-quality, engaging posts tailored to your brand and audience.
- **Schedule Posts:** Plan and automate your content calendar to maintain a consistent online presence.
- **Automate Posting:** automate your online presence with powerful AI social managers that runs 24h/24

## Getting Started

Follow these instructions to set up and run the Orbit frontend on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/)

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/your-username/orbit.git
cd orbit
```

### 2. Install Frontend Dependencies

Install the required npm packages for the React application:

```bash
npm install
```

### 3. Set Up the Backend Server

This repository does not include full original backend code, which is kept private due to security reasons for now (as this is resolved, the backend code will gradually be open sourced). To run the frontend, you will need to set up a mock backend to fill the empty functions body.

#### Install Backend Dependencies

Navigate to the `OrbitServer` directory and install its dependencies:

```bash
cd OrbitServer
npm install
```

#### Create Mock Backend Files

The core backend logic resides in `OrbitServer/apps/arthereum/OrbitRoutes.ts` and `src/backend/OrbitProvider.ts`. Since these files are not fully included, you will need to create them with placeholder content. We plan to gradually open-source these files in the future.

1. **Create `OrbitRoutes.ts`:**

   Create a new file at `OrbitServer/apps/arthereum/OrbitRoutes.ts` and add the following placeholder content. This sets up an Express router to handle API requests from the frontend.

   ```typescript
   import express from "express";

   const router = express.Router();

   // Add mock API endpoints here
   // Example:
   // router.get("/user", (req, res) => {
   //   res.json({ username: "mock_user" });
   // });

   export default router;
   ```

2. **Create `OrbitProvider.ts`:**

   Create a new file at `src/backend/OrbitProvider.ts` and add the following placeholder content. This class is responsible for all interactions with the backend, so you will need to mock its methods.

   ```typescript
   class OrbitProvider {
     // Add mock methods here
     // Example:
     // async getUser() {
     //   return { username: "mock_user" };
     // }
   }

   export default new OrbitProvider();
   ```

### 4. Run the Application

Once you have set up the frontend and mock backend, you can run the application using the following command from the root directory:

```bash
npm start
```

This will start both the React development server (on `http://localhost:3000`) and the mock backend server (on `http://localhost:3001`).

## Contributing

We welcome contributions from the community! If you would like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive messages.
4. Push your changes to your fork.
5. Submit a pull request to the main repository.

## License

This project is licensed under the PIOS License.