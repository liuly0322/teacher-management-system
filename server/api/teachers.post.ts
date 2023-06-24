export default defineEventHandler(async (event) => {
  // id, name, gender, title
  const { id, name, gender, title } = await readBody(event)
  const teacher = await event.context.prisma.teacher.create({
    data: {
      id,
      name,
      gender,
      title
    }
  })
  return teacher
})
