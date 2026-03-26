# BuildX Architecture

## Overview
BuildX is a no-code website builder with a React frontend and Node.js/Express backend connected to MongoDB.

```
frontend (React + Vite)  ──►  backend (Express)  ──►  MongoDB
        :5173                       :5000
```

---

## Frontend Structure
```
frontend/src/
├── App.jsx          # Router — controls which page renders
├── SignIn.jsx       # Login page
├── SignUp.jsx       # Registration page
├── Dashboard.jsx    # Project list + templates
├── Builder.jsx      # Drag-and-drop canvas editor
├── auth.css         # Shared auth page styles
├── dashboard.css    # Dashboard styles
├── builder.css      # Builder/canvas styles
└── index.css        # Global reset
```

### Page Flow
```
SignIn / SignUp  →  Dashboard  →  Builder (new or edit)
                       ↑               |
                       └───── onBack ──┘
```

### Builder — How Drag & Drop Works
1. Components defined in `LIBRARY` per website type
2. User drags from sidebar → `dataTransfer.setData("compDef", ...)`
3. Canvas `onDrop` reads the def, calculates position relative to canvas, snaps to 8px grid
4. Components stored as `{ id, type, x, y, w, h, props }` in state
5. Moving uses `pointer events` on `window` for smooth tracking
6. Resize handles on 8 corners use same pointer event system
7. Save → POST (new) or PUT (existing) to `/api/v1/projects`

---

## Backend Structure
```
backend/
├── index.js                  # Express app, CORS, Socket.io, routes
├── config/database.js        # Mongoose connection
├── models/
│   ├── User.js               # name, email, password, role
│   ├── Project.js            # name, userId, components[], settings
│   └── Template.js           # pre-built layouts
├── controllers/
│   ├── AuthController.js     # signup, login, logout
│   ├── ProjectController.js  # CRUD + publish
│   ├── TemplateController.js # list, use template
│   └── AIController.js       # prompt → components
├── routes/
│   ├── AuthRoutes.js
│   ├── ProjectRoutes.js
│   ├── TemplateRoutes.js
│   └── AIRoutes.js
├── middlewares/
│   └── AuthMiddleware.js     # JWT verify
└── utils/
    ├── respond.js            # standard response helper
    └── codeGenerator.js      # components → HTML/CSS
```

---

## Auth Flow
1. User signs up → password hashed with bcrypt → JWT signed with `JWT_SECRET`
2. Token returned in response body + set as httpOnly cookie
3. Frontend stores token in `localStorage`
4. Every protected request sends `Authorization: Bearer <token>`
5. `AuthMiddleware` verifies token → attaches `req.user`

---

## Environment Variables
```
MONGODBURL=mongodb://127.0.0.1:27017/buildx
PORT=5000
JWT_SECRET=your_secret_key
```
