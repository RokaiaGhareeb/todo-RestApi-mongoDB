# todo-RestfulApi-mongoDB
- A simple todo app api

## User base route '/api/user/'

- Get all users --> get('/')
- Register a new user --> post('/')
- Login --> post('/login')
- Get user profile --> get('/profile') add token to headers
- Delete user profile --> delete('/') add token to headers
- Edit user profile --> patch('/') add token to headers

## Todo base route '/api/todo/'

 dependes on userId from token

- Get all todos of a user --> get('/') 
- Add a new todo --> post('/')
- Get a specific todo --> get('/:id') 
- Delete a todo --> delete('/:id')
- Edit a todo --> patch('/:id')

## working on

- UI
- Use heroku
