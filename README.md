# What is Meenew?

Meenew is a web-based menu assistant with the goal to ease the entree discovery journey for the user.

The application is built with Next.js + Python FastAPI [serverless functions](https://vercel.com/docs/concepts/functions/serverless-functions/quickstart). 

This project was bootstrapped with the [Next.js FastAPI starter](https://vercel.com/templates/next.js/nextjs-fastapi-starter).

# Customer demo

Meenew offers a short questionnaire for a quick assessment for the best dish recomendation from the restaurant's menu.

![](https://github.com/dkubatko/meenew/blob/main/README/client.gif)

# Restaurant management demo

On the restaurant's end, all the menu items can be categorized and tagged within the category, which serves as an algorithmic base for the questionaire construction.

![](https://github.com/dkubatko/meenew/blob/main/README/server.gif)

# How to run locally?

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser for the landing page.

Python FastAPI server is served on [http://localhost:8000](http://localhost:3000) called to which are overwritten in [next.config.js](next.config.js).

# Task tracking
Current task tracking has been exported to Obsidian. 

Issues can be created on GitHub for public feature requests.

# Stack

Frontend: Next.js + Vercel
Backend: Python FastAPI, SQLModel, Alembic, Google Cloud PostgreSQL