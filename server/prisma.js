const { PrismaClient } = require('@prisma/client');

const prisma = global.prisma || new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    }
  ],
});

prisma.$on('query', (e) => {
  logger.debug(`Query: ${e.query}\nParams: ${e.params}\nDuration: ${e.duration}ms`, { label: 'prisma' })
})

module.exports = prisma;