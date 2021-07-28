import Axios from 'axios'

export const Api = () =>
  Axios.create({
    baseURL: 'https://gateway.thegraph.com/network',
  })
