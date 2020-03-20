export const getCookie = (name) => {
  const nameEQ = `${name}=`
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length)
    }
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length)
    }
  }
  return null
}

export const setCookie = (name, value, days) => {
  // eslint-disable-next-line
  let date = new Date()
  let expires = ''
  if (days) {
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    expires = `; expires=${date.toUTCString()}`
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/`
}

export const eraseCookie = (name) => {
  document.cookie = `${name}=; Max-Age=-99999999;`
}

export const escapeRegExp = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1') // eslint-disable-line no-useless-escape

export const replaceAll = (str, find, replace) => str.replace(new RegExp(escapeRegExp(find), 'g'), replace)

export const chgBodyColor = (color) => {
  document.body.style.background = color
}

export const generateToken = () => {
  const expires = new Date()
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let token = ''
  for (let i = 16; i > 0; i -= 1) {
    token += chars[Math.round(Math.random() * (chars.length - 1))]
  }

  // create expiration date
  expires.setHours(expires.getHours() + 6)

  return {
    token,
    expires,
  }
}

export const hasChromeiOS = () => {
  const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
  const hasiOS = navigator.userAgent.match(/iPhone|iPad|iPod/i)
  return Boolean(isChrome && hasiOS)
}
