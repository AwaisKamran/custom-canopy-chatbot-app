import { faker } from '@faker-js/faker'

export const generateMockUser = () => ({
  id: faker.string.nanoid(7),
  name: faker.person.fullName(),
  email: faker.internet.email()
})