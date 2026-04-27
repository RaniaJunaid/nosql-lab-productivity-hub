# Schema Design — Personal Productivity Hub

## 1. Collections Overview

| Collection | Documents represent | Key relationships |
|------------|-------------------|-------------------|
| users | App accounts | owns projects, tasks, notes |
| projects | Work containers | belongs to one user |
| tasks | Actionable items | belongs to one user + one project |
| notes | Free-form text | belongs to one user, optionally one project |

---

## 2. Document Shapes

### users
```
{
  _id: ObjectId,
  email: string (required, unique),
  passwordHash: string (required),
  name: string (required),
  createdAt: Date (required)
}
```

### projects
```
{
  _id: ObjectId,
  ownerId: ObjectId (required, → users._id),
  name: string (required),
  description: string (optional),
  archived: boolean (required, default false),
  createdAt: Date (required)
}
```

### tasks
```
{
  _id: ObjectId,
  ownerId: ObjectId (required, → users._id),
  projectId: ObjectId (required, → projects._id),
  title: string (required),
  status: string (required, enum: todo | in-progress | done),
  priority: number (required, 1-5),
  tags: string[] (required, may be empty),
  subtasks: [
    { title: string, done: boolean }
  ] (required, may be empty),
  description: string (optional),
  dueDate: Date (optional),
  createdAt: Date (required)
}
```

### notes
```
{
  _id: ObjectId,
  ownerId: ObjectId (required, → users._id),
  projectId: ObjectId (optional, → projects._id),
  title: string (required),
  body: string (required),
  tags: string[] (required, may be empty),
  pinned: boolean (optional),
  createdAt: Date (required)
}
```

---

## 3. Embed vs Reference Decisions

### subtasks → embedded inside tasks
Subtasks are always read together with their parent task and are never
queried independently. Embedding means one read fetches the task and
all its subtasks together. There is no need for a separate collection.

### tags → embedded as string arrays (tasks and notes)
Tags are simple strings with no extra data attached. They are always
read with the parent document and never queried as standalone entities.
A string array inside the document is the simplest and most efficient
solution.

### projectId → referenced in tasks and notes
Projects are queried independently (list all projects, archive a project)
and are shared across many tasks. Storing a projectId reference avoids
data duplication and keeps project data in one place.

### ownerId → referenced in projects, tasks, notes
Users are queried independently for login and signup. Storing ownerId
as a reference avoids duplicating user data across every document they
own.

---

## 4. Schema Flexibility Examples

MongoDB does not enforce a fixed schema. The following fields are
present only on SOME documents, demonstrating this flexibility:

- `description` on tasks — only added when the user provides one
- `dueDate` on tasks — only present when a deadline is set
- `pinned` on notes — only present on notes the user has pinned

A SQL table would require a column for every field on every row. In
MongoDB these fields simply do not appear in documents where they are
not needed.

---

## 5. Why Not Embed Projects Inside Users?

A user could theoretically have hundreds of projects. Embedding them
would make the user document grow unboundedly and would make it
impossible to query a single project without loading the entire user.
Keeping projects as a separate collection with an ownerId reference
gives independent read and write access to each project.