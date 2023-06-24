export default defineEventHandler(async (event) => {
  const { id } = await readBody(event)
  // 删除指定 id 的文章
  // 注意需要首先级联删除 TeacherOnPaper 表
  await event.context.prisma.teacherOnPaper.deleteMany({
    where: {
      paperId: id
    }
  })
  await event.context.prisma.paper.delete({
    where: {
      id
    }
  })
  return true
})
