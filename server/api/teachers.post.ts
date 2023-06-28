export default defineEventHandler(async (event) => {
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
