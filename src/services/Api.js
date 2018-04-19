import axios from 'axios'

export const HTTP = axios.create({
    baseURL: 'https://brainstorm-anon-backend.herokuapp.com/'
  })
