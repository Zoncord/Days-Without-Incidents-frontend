import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

// const zocnordApi = axios.create({baseURL: process.env.ZONCORD_API_URL})
// const dwiApi = axios.create({baseURL: process.env.DWI_API_URL})

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios

  app.config.globalProperties.$zoncordApi = process.env.ZONCORD_API_URL
  app.config.globalProperties.$dwiApi =  process.env.DWI_API_URL

})

// export {zocnordApi, dwiApi}
