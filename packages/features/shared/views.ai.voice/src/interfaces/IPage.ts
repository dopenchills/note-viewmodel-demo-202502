export interface IPage {
  id: string
  name: string
  getInstructions(): string
  getTools(): {
    type: string
    name: string
    description: string
    parameters: {
      type: string
      properties: Record<string, unknown>
      required: string[]
    }
  }[]
}
