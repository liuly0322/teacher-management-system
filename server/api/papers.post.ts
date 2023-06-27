export default defineEventHandler(async (event) => {
  const { name, origin, year, type, level, authors, communicationAuthor } = await readBody(event)
  return await event.context.prisma.paper.create({
    data: {
      name,
      origin,
      year: Number(year),
      type,
      level,
      TeacherOnPaper: {
        createMany: {
          data: authors.map((authorId: string, index: number) => ({
            teacherId: authorId,
            is_communicating_author: authorId === communicationAuthor,
            rank: index + 1
          }))
        }
      }
    }
  })
})
