export default defineEventHandler(async (event) => {
  const { name, origin, year, type, level, authors, communicationAuthor } = await readBody(event)

  const paper = await event.context.prisma.paper.create({
    data: {
      name,
      origin,
      year: Number(year),
      type,
      level
    }
  })

  const teacherOnPaper = await event.context.prisma.teacherOnPaper.createMany({
    data: authors.map((authorId: any, index: number) => ({
      paperId: paper.id,
      teacherId: authorId,
      is_communicating_author: authorId === communicationAuthor,
      rank: index + 1
    }))
  })

  return {
    paper,
    teacherOnPaper
  }
})
