import express from "express";

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.use(express.json());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

let todos = [];
let nextId = 1;

app.get("/todos", (req, res) => {
  res.status(200).json(todos);
});

app.post("/todos", (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({
        message: "Title is required and must be a string",
      });
    }

    const newTodo = {
      id: nextId++,
      title,
      completed: false,
    };

    todos.push(newTodo);

    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
});

app.put("/todos/:id", (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, completed } = req.body;

    const todo = todos.find((t) => t.id === id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (title !== undefined) {
      if (typeof title !== "string") {
        return res.status(400).json({ message: "Title must be a string" });
      }
      todo.title = title;
    }

    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        return res.status(400).json({ message: "Completed must be boolean" });
      }
      todo.completed = completed;
    }

    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
});

app.delete("/todos/:id", (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const index = todos.findIndex((t) => t.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todos.splice(index, 1);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Internal Server Error",
  });
});
