# Database Models

## User
| Field     | Type   | Notes                        |
|-----------|--------|------------------------------|
| name      | String | required, 2–50 chars         |
| email     | String | required, unique, lowercase  |
| password  | String | required, bcrypt hashed      |
| role      | String | enum: user, admin            |
| createdAt | Date   | auto                         |
| updatedAt | Date   | auto                         |

---

## Project
| Field        | Type       | Notes                        |
|--------------|------------|------------------------------|
| name         | String     | required, 2–100 chars        |
| description  | String     | max 500 chars                |
| userId       | ObjectId   | ref: User                    |
| components   | Component[]| array of component objects   |
| settings     | Object     | theme, layout                |
| isPublished  | Boolean    | default false                |
| publishedUrl | String     | set on publish               |
| createdAt    | Date       | auto                         |
| updatedAt    | Date       | auto                         |

### Component (sub-document)
| Field      | Type   | Notes                    |
|------------|--------|--------------------------|
| id         | String | client-generated id      |
| type       | String | button, hero, navbar etc |
| properties | Mixed  | text, src, alt etc       |
| styles     | Mixed  | width, height etc        |
| position   | Object | x, y coordinates         |

---

## Template
| Field       | Type       | Notes                  |
|-------------|------------|------------------------|
| name        | String     | required               |
| description | String     |                        |
| category    | String     | Landing Page, Blog etc |
| components  | Component[]| pre-built layout       |
| settings    | Object     | theme, layout          |
| usageCount  | Number     | incremented on use     |
| isActive    | Boolean    | default true           |
| createdAt   | Date       | auto                   |
