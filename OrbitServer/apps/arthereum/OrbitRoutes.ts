import express, { Request, Response } from "express";


const OrbitRoutes = express.Router();
OrbitRoutes.get("/workspace/:workspaceId", async (req: Request, res: Response) => {});

OrbitRoutes.get("/auth/socials/twitter/oauth_url", async (req: Request, res: Response) => {});

OrbitRoutes.get("/auth/socials/threads/oauth_url", async (req: Request, res: Response) => {});

OrbitRoutes.get("/auth/socials/twitter/callback", async (req: Request, res: Response) => {});

OrbitRoutes.post("/post-content", async (req: Request, res: Response) => {});

OrbitRoutes.post("/post-scheduled-now", async (req: Request, res: Response) => {});

OrbitRoutes.get("/dashboard-data", async (req: Request, res: Response) => {});

OrbitRoutes.post("/accounts/missing-data", async (req: Request, res: Response) => {});

OrbitRoutes.get("/posts", async (req: Request, res: Response) => {});

OrbitRoutes.get("/posts/:postId", async (req: Request, res: Response) => {});

OrbitRoutes.get("/calendar", async (req: Request, res: Response) => {});

OrbitRoutes.get("/analytics-dashboard-data", async (req: Request, res: Response) => {});

OrbitRoutes.get("/auth/socials/reddit/oauth_url", async (req: Request, res: Response) => {});

OrbitRoutes.get("/auth/socials/threads/callback", async (req: Request, res: Response) => {});

OrbitRoutes.post("/auth/socials/bluesky/connect", async (req: Request, res: Response) => {});

OrbitRoutes.get("/auth/socials/reddit/callback", async (req: Request, res: Response) => {});

OrbitRoutes.get("/interactions-growth", async (req: Request, res: Response) => {});