export default defineEventHandler(async (event) => {
  // id, name, type, total_class_hour
  const { id, name, type, totalClassHour } = await readBody(event)
  return await event.context.prisma.class.create({
    data: {
      id,
      name,
      type,
      total_class_hour: totalClassHour
    }
  })
})
