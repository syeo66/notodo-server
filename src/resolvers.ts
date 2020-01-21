import axios from 'axios'

const PORT = process.env.port || 3000

const resolvers = {
  todo: async ({ id }, context) => {
    const { token } = context()
    const response = await axios({
      url: `http://localhost:${PORT}/todo/${id}`,
      method: 'get',
      headers: {
        Authorization: token,
      },
    })
    return response.data.todo
  },
  todos: async (_, context) => {
    const { token } = context()
    const response = await axios({
      url: `http://localhost:${PORT}/todos`,
      method: 'get',
      headers: {
        Authorization: token,
      },
    })
    return response.data.todos
  },
}

export default resolvers
