import { ref } from 'vue'
import moment from 'jalali-moment'
import { helpers } from '@vuelidate/validators'
import { responeCodes, chNumber } from './_constant'
import jwt_decode from 'jwt-decode'
import store from '../../store'

let _menu = ref(false)
const changeMenu = () => (_menu.value = !_menu.value)

const toGregorian = (persianDate) => {
  return persianDate ? moment.from(persianDate, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD') : null
}
const toSolar = (gregorianDate) => {
  return gregorianDate
    ? moment(gregorianDate, 'YYYY-MM-DD HH:mm:ss').locale('fa').format('YYYY/MM/DD HH:mm:ss')
    : null
}

const numToChar = (num) => chNumber[num]

const check_national_code = helpers.regex(/^(?!(\d)\1{9})\d{10}$/)
const checkPhoneRegex = helpers.regex(/^0\d{2}\d{8}$/)
const checkMobileRegex = helpers.regex(/^09(1[0-9]|3[1-9]|2[1-9])-?[0-9]{3}-?[0-9]{4}$/)

const responeHandeler = (resCode) => {
  return Object.values(responeCodes).filter((item) => item.msgCode == resCode)[0]
}

const getCompanionsById = (arr, id) => {
  return arr.filter((item) => item.user == id)
}
const setCompanionsDefault = (arr, allId) => {
  let result = []
  Object.values(allId).forEach((id) => {
    // result.push(arr.filter((item) => item._id == id))
    let value = arr.filter((item) => item._id == id)[0]
    value && result.push(value)
  })
  return result
}

const getTimestampInSeconds = () => {
  return Math.floor(Date.now() / 1000)
}

const authToken = (token) => {
  return new Promise((resolve, reject) => {
    let decodeJWT

    try {
      decodeJWT = jwt_decode(token)
    } catch (er) {
      reject({ valid: false, msg: 'Invalid Token' })
    }

    if (decodeJWT.fullName && decodeJWT.id) {
      store.state.userInfo = {
        fullName: decodeJWT.fullName,
        id: decodeJWT.id
      }
    } else {
      reject({ valid: false, msg: 'Invalid Token' })
    }

    let nowDate = getTimestampInSeconds()
    if (nowDate > decodeJWT?.exp) {
      reject({ valid: false, msg: 'Expired Token' })
    } else {
      resolve({ valid: true, msg: 'Valid Token' })
    }
  })
}

export {
  _menu,
  authToken,
  setCompanionsDefault,
  getCompanionsById,
  changeMenu,
  toGregorian,
  toSolar,
  check_national_code,
  checkPhoneRegex,
  checkMobileRegex,
  responeHandeler,
  numToChar
}
