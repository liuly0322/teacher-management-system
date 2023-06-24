export default defineEventHandler(async (event) => {
  const { id, term, year, teachHours } = await readBody(event)
  // 011147 SPRING 2023 [ { teacherId: 'T0002', num: 50 }, { teacherId: 'T0003', num: 40 } ]
  // 1. 验证课程号对应的课程所具有的总学时和当前请求的 teachHours 各个老师承担学时之和是否相等
  const classInfo = await event.context.prisma.class.findUnique({
    where: {
      id
    }
  })
  if (!classInfo || classInfo.total_class_hour !== teachHours.reduce((acc: number, cur: { num: number }) => acc + cur.num, 0)) {
    throw new Error('课程号对应的课程所具有的总学时和当前请求的 teachHours 各个老师承担学时之和不相等')
  }
  // 2. 插入 TeacherOnClass 表
  return await event.context.prisma.teacherOnClass.createMany({
    data: teachHours.map((item: { teacherId: string, num: number }) => ({
      classId: id,
      teacherId: item.teacherId,
      term,
      year,
      class_hour: item.num
    }))
  })
})
