export default defineEventHandler(async (event) => {
  const { id } = await readBody(event)
  // 删除指定 id 的文章
  // 注意需要首先级联删除 TeacherOnProject 表
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
