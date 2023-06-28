export default defineEventHandler(async (event) => {
  const { id, year, term } = await readBody(event)
  return await event.context.prisma.teacherOnClass.deleteMany({
    where: {
      classId: id,
      year: Number(year),
      term
    }
  })
})
