export default defineEventHandler(async (event) => {
  const { classId } = getQuery(event)
  return await event.context.prisma.teacherOnClass.findMany({
    where: {
      classId: classId as string
    }
  })
})
