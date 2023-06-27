export default defineEventHandler(async (event) => {
  // id, name, gender, title
  const { id, name, gender, title } = await readBody(event)
  return await event.context.prisma.teacher.create({
    data: {
      id,
      name,
      gender,
      title
    }
  })
})
