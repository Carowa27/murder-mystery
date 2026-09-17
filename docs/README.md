# Docs

## ER diagram

The database diagram is in [diagrams/erd.png](diagrams/erd.png).

It is drawn from [../db/schema.dbml](../db/schema.dbml), which mirrors `db/schema.sql` without RLS, triggers and functions. Paste the dbml file into a new diagram on [dbdiagram.io](https://dbdiagram.io) and export as PNG. When the schema changes, update the dbml file and export a new image in the same pull request.

## Commit message convention

Format:

```
type: message
```

Examples:

```
docs: add readme
ref: update all js to ts
```

### Types

| Type          | Short    | Description                                             |
| ------------- | -------- | ------------------------------------------------------- |
| feature       | `feat`   | New feature                                             |
| bug fix       | `bug`    | Bug fix                                                 |
| documentation | `docs`   | Changes or additions to documentation                   |
| refactor      | `ref`    | Code changes that neither fix a bug nor add a feature   |
| build         | `build`  | Changes that affect the build or dependencies           |
| reverts       | `revert` | Revert to a previous commit                             |
| clean         | `clean`  | Clean up code, for example comments or unnecessary code |
