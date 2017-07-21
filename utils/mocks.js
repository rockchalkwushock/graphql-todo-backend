/* eslint-disable camelcase */

export default {
  completeTodo: (id, complete, user_id) => `
    mutation {
      completeTodo(id:"${id}", completed:${complete}, user_id:"${user_id}")
    }
  `,
  createTodo: (text, user_id) => `
    mutation {
      createTodo(text:"${text}", user_id:"${user_id}") {
        id
        text
        completed
      }
    }
  `,
  deleteTodo: (id, user_id) => `
    mutation {
      deleteTodo(id:"${id}", user_id:"${user_id}")
    }
  `,
  deleteUser: id => `
    mutation {
      deleteUser(id:"${id}")
    }
  `,
  findAllUsers: `
    query {
      findAllUsers {
        id
      }
    }
  `,
  findUserById: id => `
    query {
      findUserById(id:"${id}") {
        username
      }
    }
  `,
  findUserTodos: user_id => `
    query {
      findUserTodos(user_id:"${user_id}") {
        id
        completed
        text
      }
    }
  `,
  login: (email, password) => `
    mutation {
      login(email:"${email}", password:"${password}")
    }
  `,
  register: (a, b, c) => `
    mutation {
      register(username:"${a}", email:"${b}", password:"${c}") {
        id
        email
      }
    }
  `,
  updateTodo: (id, newText, user_id) => `
    mutation {
      updateTodo(id:"${id}", newText:"${newText}", user_id:"${user_id}")
    }
  `,
  updateUser: (id, newUsername) => `
    mutation {
      updateUser(id:"${id}", newUsername:"${newUsername}")
    }
  `
}
