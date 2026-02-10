Authentication & Authorization Features
* User Registration
o Username and password registration
o Passwords securely hashed with bcrypt
* Login System
o Session-based authentication using JWT stored in HTTP-only cookies
o CSRF protection with tokens and headers
* Logout
o Clears JWT cookie and session on logout
* Session Handling
o Auth state persists using backend session validation (/api/auth/session)
o Automatic token expiration (free users: 20 min, admins: 2 hours)

API Key Management
* API key is auto-generated during registration
* Each user has a unique API key saved in the database
* Admins can see and manage keys from dashboard

User Role Features
* Free Users:
o Allowed only 10 country searches
o Search counter tracked per user
o Reset after 10 minutes when the limit is hit
* Paid Users:
o Unlimited searches
o Status stored in DB (isPaid)
* Admins:
o Special isAdmin flag set in the DB
o Extended session duration (2 hours)
o Access to admin dashboard

Admin Dashboard
* See list of all registered users
* View user’s:
o Username
o API Key
o Search Count
o Paid Status
* Actions for Admin:
o Upgrade user to paid
o Reset search counter

Security Features
* Password hashing (bcryptjs)
* Session management using JWT + cookies
* CSRF protection using csurf middleware
* Route protection middleware:
o authenticateToken – Verifies JWT
o isAdmin – Verifies admin role
* CORS enabled only for frontend origin (http://localhost:3000)
* Safe cookie settings: httpOnly, sameSite, secure in production

Frontend Features (React)
* Pages:
o Login
o Register
o Search
o Admin Dashboard
* Search with Suggestions
o Suggests countries as you type
o Clicking suggestion fills input
* Back Button UI
o Back navigation on all pages (except Home)
* Error Handling
o Displays error messages from server (e.g., session expired, login failed)

Country API Integration
* Uses REST Countries API
* Fetches:
o All countries
o Country by name
* Fields shown:
o Country name
o Capital
o Currency
o Languages
o National flag
* Displayed in card format after search

Dockerized Backend
* Dockerfile created
* Can build and run backend as container:
bash
CopyEdit
docker build -t my-backend .
docker run -p 5000:5000 --env-file .env my-backend

Database Features (MySQL + Sequelize)
* User model includes:
o id, username, password, apiKey, isPaid, isAdmin, searchCount, lastSearchTime
* Sequelize migrations with auto alter sync
* Search tracking and resets per user


