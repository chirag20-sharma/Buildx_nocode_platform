# BuildX API Documentation

Base URL: `http://localhost:5000/api/v1`

---

## Auth

### POST `/auth/signup`
Register a new user.

**Body**
```json
{ "name": "Chirag", "email": "chirag@test.com", "password": "123456" }
```

**Response**
```json
{ "success": true, "payload": { "token": "...", "user": { "id": "...", "name": "Chirag", "email": "..." } } }
```

---

### POST `/auth/login`
Login with existing credentials.

**Body**
```json
{ "email": "chirag@test.com", "password": "123456" }
```

---

### POST `/auth/logout`
Clears the auth cookie.

---

## Projects
All routes require `Authorization: Bearer <token>` header.

### GET `/projects`
Get all projects for the logged-in user.

### POST `/projects`
Create a new project.

**Body**
```json
{
  "name": "My Landing Page",
  "description": "Created with BuildX",
  "components": [
    {
      "id": "btn-1",
      "type": "button",
      "properties": { "text": "Click Me" },
      "position": { "x": 100, "y": 200 },
      "styles": { "width": 160, "height": 44 }
    }
  ]
}
```

### GET `/projects/:id`
Get a single project by ID.

### PUT `/projects/:id`
Update an existing project (same body as POST).

### DELETE `/projects/:id`
Delete a project.

### PATCH `/projects/:id/publish`
Toggle publish/unpublish status.

---

## Templates

### GET `/templates`
Get all available templates (public, no auth required).

### POST `/templates/:id/use`
Create a new project from a template.

**Body**
```json
{ "projectName": "My Copy" }
```

---

## AI

### POST `/ai/generate`
Generate component layout from a text prompt.

**Headers:** `Authorization: Bearer <token>`

**Body**
```json
{ "prompt": "Create a hero section with a button", "websiteType": "Landing Page" }
```

**Response**
```json
{
  "success": true,
  "payload": {
    "components": [...],
    "suggestion": "Generated 3 components for your Landing Page"
  }
}
```

---

## Component Types
Allowed values for `type` field:
`button`, `input`, `text`, `image`, `container`, `form`, `navbar`, `footer`, `hero`, `header`, `card`
