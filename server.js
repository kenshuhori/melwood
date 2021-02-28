const express  = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/mydb');

const Todo = mongoose.model('Todo', {
    text : String
});

app.get('/api/todos', (req, res) => {
    Todo.find()
        .then((todos) => {
            res.json(todos);
        })
        .catch((err) => {
            res.send(err);
        })
});

app.post('/api/todos', (req, res) => {
    const todo = req.body;
    Todo.create({
            text : todo.text,
        })
        .then((todo) => {
            res.json(todo);
        })
        .catch((err) => {
            res.send(err);
        });
});

app.delete('/api/todos/:todo_id', (req, res) => {
    Todo.remove({
            _id : req.params.todo_id
        })
        .then((todo) => {
           res.send(todo); 
        })
        .catch((err) => {
            res.send(err);
        });
});

app.get('/', (req, res) => {
    res.sendfile('./public/index.html');
});

app.listen(3000, () => {
    console.log("My app listening on port 3000!");
});
