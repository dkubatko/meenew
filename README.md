# What is Meenew?

Meenew is a web-based menu assistant with the goal to ease the entree discovery journey for the user.

The application is built with Next.js + Python FastAPI [serverless functions](https://vercel.com/docs/concepts/functions/serverless-functions/quickstart). 

This project was bootstrapped with the [Next.js FastAPI starter](https://vercel.com/templates/next.js/nextjs-fastapi-starter).

# How to run locally?

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser for the landing page.

Python FastAPI server is served on [http://localhost:8000](http://localhost:3000) called to which are overwritten in [next.config.js](next.config.js).

# Current task list
## In progress
- [ ] Add restaurant management page
- [ ] Add appropriate headers
- [ ] Add client generator
- [ ] Add props typing
- [ ] Set 0 margin for middle items in circularOffset
- [ ] Extract mascot into a component and adjust its styling
- [ ] Add results page
- [ ] Design application flow
- [ ] Update headers and metadata
- [ ] Add JWS tokens (or other encryption) for api
- [ ] Add QR code
- [ ] Fix 'not defined' for client-side functions on the server render
- [ ] Add cat animations
- [ ] Add Toast API integration
- [ ] Add Square API integration
## Complete
- [X] Fix Create with Relation in API
- [X] Migrate to SQLModel
- [X] Create db schema
- [X] Add SQLite integration
- [X] Fix circular translate initial div height reading on mobile
- [X] Refactor loading flow
- [X] Fix CSS for mobile
- [X] Fix image boxing to not cover buttons
- [X] Adjust circularTranslate to be vh-based
- [X] Split CSS into modules
- [X] Add loading spinners
- [X] Extract components from questionnaire
- [X] Add readme with task tracking
- [x] fix side buttons
- [x] fix circular translate
- [X] Update circular translate to use parabolic func
- [X] Switch back and skip to arrows
- [X] Progress bar
- [X] Fix animations stuck after one
- [X] Make responsive
- [X] Add FastAPI server + connect
- [X] Split into client and server components
- [X] Refactor code into components
- [X] github
- [X] Deploy to vercel
- [X] Fix routing
