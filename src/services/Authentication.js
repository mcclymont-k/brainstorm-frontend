import Api from './Api'

export default {
  register() {
    return Api().get('/name')
  }
}
