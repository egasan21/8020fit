const mockWgerService = require('../services/mockWgerService');
const { logger } = require('../middleware/logging');

async function seedMockData() {
  try {
    await mockWgerService.initializeMockData();
    logger.info('Mock data seeding completed');
  } catch (error) {
    logger.error('Mock data seeding failed', { error });
    process.exit(1);
  }
}

if (require.main === module) {
  seedMockData();
}