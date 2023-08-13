// import { responeHandeler } from '../js/init'

let result = ''

export const checkStatus = (response, status) => {
  switch (status) {
    case 200:
    case 201:
    case 204:
      result = { status: true, msg: 'عملیات با موفقیت انجام شد' }
      break
    case 400:
    case 413:
      result = { status: false, msg: 'خطا در ارسال اطلاعات' }
      break
    case 401:
      result = { status: false, msg: 'خطا در اعتبار سنجی', redirect: '/login' }
      break
    case 403:
      result = { status: false, msg: 'خطای عدم دسترسی' }
      break
    case 404:
      result = { status: false, msg: 'آیتم مورد نظر یافت نشد' }
      break
    case 409:
    case 410:
      result = { status: false, msg: response.message }
      break
    case 422:
      result = { status: false, msg: 'اطلاعات وروردی نامعتبر هست' }
      break
    case 500:
      result = { status: false, msg: 'خطایی در سرور رخ داده است' }
      break
    case 501:
      result = { status: false, msg: 'مسیر مورد نظر پیدا نشد' }
      break
  }
  return result
}
