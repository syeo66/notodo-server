import axios from 'axios'
import { format, parseISO } from 'date-fns'
import { URLSearchParams } from 'url'
import { IncomingMessage, ServerResponse } from 'http'

// TODO: make hostname configurable, too
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
  allTodos: async (_, context) => {
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
  todos: async ({ date }, context) => {
    const { token } = context()
    const response = await axios({
      url: `http://localhost:${PORT}/todos${
        date && date !== format(new Date(), 'yyyy-MM-dd') ? '/' + date : '/current'
      }`,
      method: 'get',
      headers: {
        Authorization: token,
      },
    })
    return response.data.todos
  },
  createTodo: async ({ todo }, context) => {
    const { token } = context()
    const response = await axios({
      url: `http://localhost:${PORT}/todo`,
      method: 'post',
      headers: {
        Authorization: token,
      },
      data: todo,
    })
    return response.data.todo
  },
  updateTodo: async ({ id, todo }, context) => {
    const { token } = context()
    const response = await axios({
      url: `http://localhost:${PORT}/todo/${id}`,
      method: 'PUT',
      headers: {
        Authorization: token,
      },
      data: todo,
    })
    return response.data.todo
  },
  deleteTodo: async ({ id }, context) => {
    const { token } = context()
    const response = await axios({
      url: `http://localhost:${PORT}/todo/${id}`,
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    })
    return response.data.success === 1
  },
  profile: async (_, context) => {
    const { token } = context()
    const response = await axios({
      url: `http://localhost:${PORT}/profile`,
      method: 'get',
      headers: {
        Authorization: token,
      },
    })
    return response.data.user
  },
  login: async ({ username, password }, context) => {
    const response = await axios({
      url: `http://localhost:${PORT}/login`,
      method: 'POST',
      data: new URLSearchParams({ name: username, password }),
    })

    const { res } = context()

    res.cookie('refresh_token', response.data.refreshToken, {
      httpOnly: true,
      secure: (process.env.NODE_ENV || 'development') !== 'development',
      expires: parseISO(response.data.refreshTokenExpiry),
    })

    return response.data
  },
  refresh: async (_, context) => {
    const { token, res, req } = context()
    const response = await axios({
      url: `http://localhost:${PORT}/refresh`,
      method: 'POST',
      headers: {
        Authorization: token,
        cookie: 'refresh_token=' + req.cookies.refresh_token,
      },
    })

    res.cookie('refresh_token', response.data.refreshToken, {
      httpOnly: true,
      secure: (process.env.NODE_ENV || 'development') !== 'development',
      expires: parseISO(response.data.refreshTokenExpiry),
    })

    return response.data
  },
}

export default resolvers
