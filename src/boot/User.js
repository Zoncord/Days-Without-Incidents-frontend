import {boot} from 'quasar/wrappers'

export default boot(async ({app, router, store}) => {
  let axios = app.config.globalProperties.$axios
  let enterRedirectLink = `${process.env.ZONCORD_URL}o/authorize/?response_type=code&client_id=cTGQ0iGxACKy6VXtV9nvHLldfSQtFl1OXiwPgbTR&redirect_uri=https://dwi.zoncord.tech/auth/`
  app.config.globalProperties.$enterRedirect = enterRedirectLink
  await axios.get(process.env.DWI_API_URL + 'users/profile/', {
    headers: {
      Authorization: `Token ${store.getters['mainStore/token']}`
    }
  }).then(async (profileRes) => {
    await axios.get(profileRes.data.url, {
      headers: {
        Authorization: `Token ${store.getters['mainStore/token']}`
      }
    }).then(res => {
      app.config.globalProperties.$userName = res.data.general_user_information.first_name + ' ' + res.data.general_user_information.last_name
      app.config.globalProperties.$userImage = res.data.general_user_information.img
      app.config.globalProperties.$userId = res.data.id
      app.config.globalProperties.$userUrl = res.data.url
      app.config.globalProperties.$userDescription = res.data.description
      app.config.globalProperties.$userFollowersCount = res.data.followers_count
    })
  })
    .catch(err => {
      if (err.response && err.response.status === 401 && window.location.pathname !== '/auth/' && window.location.pathname !== '/auth') {
        window.location.href = enterRedirectLink
      }
    })

})
