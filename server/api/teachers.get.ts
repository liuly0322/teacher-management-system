export default defineEventHandler(event => event.context.prisma.teacher.findMany())
