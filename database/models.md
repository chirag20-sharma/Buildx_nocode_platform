## User Collection
{
  _id,
  name,
  email,
  password,
  createdAt
}

## Project Collection
{
  _id,
  userId,
  projectName,
  components: [],
  createdAt,
  updatedAt
}

## Component Object
{
  type,
  properties,
  styles
}