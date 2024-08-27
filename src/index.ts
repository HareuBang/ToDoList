import express, { Request, Response } from 'express';
import path from 'path';
import methodOverride from 'method-override';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

// Set up view engine and static files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

interface List {
  title: string,
  memo: string, 
  date: string, 
  priority: string, 
  id: string, 
  now: Date
}

// In-memory data store
let toDo: List[] = [];
let edit: { title: string, memo: string, date: string, priority: string, id: string, now: Date }[] = [];

// Routes
app.get('/home', (req: Request, res: Response) => {
  res.render('home', { toDo, edit });
});

app.post('/home', (req: Request, res: Response) => {
  const { title, memo, date, priority } = req.body;
  const now = new Date(Date.now());
  toDo.push({ title, memo, date, priority, id: uuidv4(), now });
  res.redirect('home');
});

app.patch('/home/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  edit = toDo.filter(d => d.id === id);
  res.redirect('/home');
});

app.patch('/home/edit/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, memo, date, priority } = req.body;
  const idx = toDo.findIndex(d => d.id === id);
  if (idx !== -1) {
    const now = toDo[idx].now;
    toDo[idx] = { title, memo, date, priority, id, now };
  }
  res.redirect('/home');
});

app.delete('/home/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  toDo = toDo.filter(d => d.id !== id);
  res.redirect('/home');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
