const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuid4 } = require("uuid");
uuid4();


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

let toDo = [];
let edit = [];

app.get('/home', (req, res) => {
  res.render('home', {toDo, edit});
})
app.post('/home', (req, res) => {
  const {title, memo, date, priority} = req.body;
  const now = new Date(Date.now());
  toDo.push({title, memo, date, priority, id:uuid4(), now})
  res.redirect('home')
})

// Update
app.patch("/home/:id", (req, res) => {
  const { id } = req.params;
  edit = toDo.filter(d => d.id === id);
  res.redirect('/home');
})
app.patch("/home/edit/:id", (req, res) => {
  const { id } = req.params;
  const { title, memo, date, priority } = req.body;
  const idx = toDo.findIndex(d => d.id === id);
  const now = toDo[idx].now;
  toDo[idx] = { title, memo, date, priority, id, now};
  res.redirect('/home');
})

app.delete('/home/:id', (req, res) => {
  const { id } = req.params;
  toDo = toDo.filter(d => d.id !== id);
  res.redirect("/home");
})

app.listen(3000, () => {
  console.log("ON PORT 3000");
});