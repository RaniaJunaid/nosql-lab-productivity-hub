# Schema Design

## Collections

### 1. users
Each document represents one user of the app.

**Fields:**
- `_id`: ObjectId (auto-generated)
- `name`: String
- `email`: String (unique)
- `passwordHash`: String
- `createdAt`: Date

**Embed vs Reference:** Nothing is embedded. Projects and notes reference the user via `userId`.

---

### 2. projects
Each document is a project owned by a user.

**Fields:**
- `_id`: ObjectId
- `userId`: ObjectId (reference to users)
- `name`: String
- `description`: String
- `archived`: Boolean (default: false)
- `createdAt`: Date

**Embed vs Reference:** Tasks are NOT embedded here — they are a separate collection referencing `projectId`. Tasks are queried independently by status and priority, so they need their own collection.

---

### 3. tasks
Each task belongs to a project and contains embedded subtasks and tags.

**Fields:**
- `_id`: ObjectId
- `projectId`: ObjectId (reference to projects)
- `title`: String
- `status`: String — "todo" | "in-progress" | "done"
- `priority`: Number (1 = high, 3 = low)
- `tags`: Array of Strings (embedded)
- `subtasks`: Array of objects (embedded)
  - `title`: String
  - `done`: Boolean
- `createdAt`: Date
- `dueDate`: Date *(schema flexibility — only present on some tasks)*

**Embed vs Reference:**
- **subtasks** are embedded because they are owned by the task and always read with it.
- **tags** are embedded as a simple string array.
- **projectId** is a reference because projects are queried independently.

---

### 4. notes
Each note can be standalone or attached to a project.

**Fields:**
- `_id`: ObjectId
- `userId`: ObjectId (reference to users)
- `projectId`: ObjectId or null (optional reference to projects)
- `title`: String
- `body`: String
- `tags`: Array of Strings (embedded)
- `createdAt`: Date
- `pinned`: Boolean *(schema flexibility — only present on some notes)*

**Embed vs Reference:** Notes reference users and optionally projects. Tags are embedded since they are simple strings used only for filtering.

---

## Schema Flexibility Example

The `dueDate` field on tasks and the `pinned` field on notes are only present on **some** documents. MongoDB allows this without any schema changes — documents in the same collection do not need identical fields.