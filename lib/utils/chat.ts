export function isColorMessage(message: string): boolean {
  const match = message.match(/Tent colors are:\s*(\{.*\})/)
  if (match) {
    return true
  }
  return false
}
