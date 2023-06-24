export default defineEventHandler(event => event.context.prisma.class.findMany())
