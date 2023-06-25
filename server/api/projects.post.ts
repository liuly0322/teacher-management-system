export default defineEventHandler(async (event) => {
  const { id, name, origin, type, fund, startYear, endYear, teacherFunds } = await readBody(event)
  // [ { teacherId: 'T0002', num: 0 }, { teacherId: 'T0001', num: 0 } ]
  // 1. 验证 fund 是否等于各个老师经费之和
  const totalFund = teacherFunds.reduce((acc: number, cur: { num: number }) => {
    return acc + cur.num
  }, 0)
  if (Math.abs(fund - totalFund) > 1e-5) {
    throw new Error('各老师承担经费和不为总经费！')
  }
  // 2. 插入 Project 表和 TeacherOnProject 表
  return await event.context.prisma.$transaction([
    event.context.prisma.project.create({
      data: {
        id,
        name,
        origin,
        type,
        total_fund: fund,
        start_year: startYear,
        end_year: endYear
      }
    }),
    event.context.prisma.teacherOnProject.createMany({
      data: teacherFunds.map((teacherFund: { teacherId: string, num: number }, index: number) => ({
        projectId: id,
        teacherId: teacherFund.teacherId,
        rank: index + 1,
        fund: teacherFund.num
      }))
    })
  ])
})
