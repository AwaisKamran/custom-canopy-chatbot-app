import { faker } from '@faker-js/faker'

export function generateMockSaveFileData() {
  const chatId = faker.string.nanoid(7)
  const filename = faker.system.fileName()
  const userId = faker.string.nanoid(7)
  const file = faker.string.sample(1024)
  const blobMockResponse = {
    url: `https://fakeblobstorage.com/user/${userId}/chat/${chatId}/${filename}`,
    size: 1024,
    contentType: 'text/plain',
    downloadUrl: `https://fakeblobstorage.com/user/${userId}/chat/${chatId}/${filename}/download`,
    pathname: '/blob/path',
    contentDisposition: 'attachment; filename="example.txt"'
  }

  return {
    chatId,
    filename,
    userId,
    file,
    blobMockResponse
  }
}
