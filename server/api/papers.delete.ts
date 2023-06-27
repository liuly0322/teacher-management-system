export default defineEventHandler(async (event) => {
  const { id } = await readBody(event)
  return await event.context.prisma.$transaction([
    event.context.prisma.teacherOnPaper.deleteMany({
      where: {
        paperId: id
      }
    }),
    event.context.prisma.paper.delete({
      where: {
        id
      }
    })
  ])
})
