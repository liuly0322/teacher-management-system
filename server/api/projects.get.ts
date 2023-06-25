export default defineEventHandler((event) => {
  const { id, name, origin, type, startYear, endYear } = getQuery(event)
  const conditions = Object()
  if (id) { conditions.id = { equals: id } }
  if (name) { conditions.name = { contains: name } }
  if (origin) { conditions.origin = { contains: origin } }
  if (type) { conditions.type = { equals: type } }
  if (startYear) { conditions.start_year = { equals: Number(startYear) } }
  if (endYear) { conditions.end_year = { equals: Number(endYear) } }
  return event.context.prisma.project.findMany(
    {
      where: conditions,
      select: {
        id: true,
        name: true,
        origin: true,
        type: true,
        start_year: true,
        end_year: true,
        TeacherOnProject: {
          select: {
            teacher: {
              select: {
                id: true,
                name: true
              }
            },
            rank: true,
            fund: true
          }
        }
      }
    }
  )
})
