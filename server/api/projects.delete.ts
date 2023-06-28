export default defineEventHandler(async (event) => {
  const { id } = await readBody(event)
  return await event.context.prisma.$transaction([
    event.context.prisma.teacherOnProject.deleteMany({
      where: {
        projectId: id
      }
    }),
    event.context.prisma.project.delete({
      where: {
        id
      }
    })
  ])
})
