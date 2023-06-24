import { PaperType, PaperLevel } from '@prisma/client'

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

export default defineEventHandler((event) => {
  const { name, origin, year, type, level, authors } = parseUrl(event.path)
  if (type && !Object.values(PaperType).includes(type as PaperType)) { throw new Error('Invalid paper type') }
  if (level && !Object.values(PaperLevel).includes(level as PaperLevel)) { throw new Error('Invalid paper level') }
  const authorIds = (authors || '').split(',').filter((authorId: any) => authorId)
  const conditions = Object()
  if (name) { conditions.name = { contains: name } }
  if (origin) { conditions.origin = { contains: origin } }
  if (year) { conditions.year = { equals: Number(year) } }
  if (type) { conditions.type = { equals: type as PaperType } }
  if (level) { conditions.level = { equals: level as PaperLevel } }
  if (authorIds.length > 0) {
    conditions.TeacherOnPaper = {
      some: {
        teacher: {
          id: { in: authorIds }
        }
      }
    }
  }
  return event.context.prisma.paper.findMany(
    {
      where: conditions,
      select: {
        id: true,
        name: true,
        origin: true,
        year: true,
        type: true,
        level: true,
        TeacherOnPaper: {
          select: {
            teacher: {
              select: {
                id: true,
                name: true
              }
            },
            rank: true,
            is_communicating_author: true
          }
        }
      }
    }
  )
})
