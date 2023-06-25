export default defineEventHandler(async (event) => {
  const { id, startYear, endYear } = getQuery(event)
  return await event.context.prisma.teacher.findUnique({
    where: {
      id: id as string
    },
    select: {
      id: true,
      name: true,
      gender: true,
      title: true,
      TeacherOnPaper: {
        where: {
          paper: {
            year: {
              gte: Number(startYear),
              lte: Number(endYear)
            }
          }
        },
        select: {
          rank: true,
          is_communicating_author: true,
          paper: true
        }
      },
      TeacherOnProject: {
        where: {
          project: {
            start_year: {
              gte: Number(startYear)
            },
            end_year: {
              lte: Number(endYear)
            }
          }
        },
        select: {
          fund: true,
          project: true
        }
      },
      TeacherOnClass: {
        where: {
          year: {
            gte: Number(startYear),
            lte: Number(endYear)
          }
        },
        select: {
          year: true,
          term: true,
          class_hour: true,
          class: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  })
})
