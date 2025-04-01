import type { JSONSchema4 } from 'json-schema'

export interface Tool {
  type: 'function'
  name: string
  description: string
  parameters: JSONSchema4
}

export interface IPage {
  /**
   * Unique identifier for the page
   */
  readonly id: string

  /**
   * Display name of the page
   */
  readonly name: string

  load(): Promise<void>

  unload(): Promise<void>

  /**
   * Get the instructions for the AI model
   * @returns Instructions string that defines the AI's behavior and personality
   */
  getInstructions(): string

  /**
   * Get the tools available for this page
   * @returns Array of tool definitions that the AI can use
   */
  getTools(): Tool[]

  /**
   * Run a tool with the given name and arguments
   * @param name The name of the tool to run
   * @param args The arguments to pass to the tool
   * @returns A promise that resolves to the tool's result
   */
  runTool(name: string, args: unknown): Promise<unknown>
}
