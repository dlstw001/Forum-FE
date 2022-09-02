export const generateRandomName = (length = 15, chars) => {
  chars = chars ? chars : [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789']
  return [...Array(length)].map(() => chars[(Math.random() * chars.length) | 0]).join('')
}

export const generateSerialNumber = (length = 4, separator = '-') => {
  const randomString = () =>
    Math.random()
      .toString(16)
      .substring(2, length + 2)

  return [randomString(), randomString(), randomString()].join(separator).toUpperCase()
}
