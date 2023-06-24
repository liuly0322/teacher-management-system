function parseUrl (url: string) {
  const regUrl = /^[^?]+\?([\w\W]+)$/
  const regPara = /([^&=]+)=([\w\W]*?)(&|$|#)/g
  const arrUrl = regUrl.exec(url)
  const ret = Object()
  if (arrUrl && arrUrl[1]) {
    const strPara = arrUrl[1]; let result
    while ((result = regPara.exec(strPara)) != null) {
      ret[result[1]] = decodeURI(result[2])
    }
  }
  return ret
}

export default defineEventHandler(async (event) => {
  const { classId } = parseUrl(event.path)
  return await event.context.prisma.teacherOnClass.findMany({
    where: {
      classId: classId as string
    }
  })
})
