export default defineEventHandler(async (event) => {
  const { id, year, term } = await readBody(event)
  // 删除 TeacherOnClass 中所有满足 id, year, term 的记录
  await event.context.prisma.teacherOnClass.deleteMany({
    where: {
      classId: id,
      year: Number(year),
      term
    }
  })
  return true
})
