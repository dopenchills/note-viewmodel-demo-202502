import type { JSONSchema4 } from 'json-schema'

export interface Tool {
  type: 'function'
  name: string
  description: string
  parameters: JSONSchema4
}

type InferParamType<T extends JSONSchema4> = T extends { type: 'string' }
  ? string
  : T extends { type: 'number' }
    ? number
    : T extends { type: 'boolean' }
      ? boolean
      : T extends { type: 'object'; properties: infer P }
        ? { [K in keyof P]: P[K] extends JSONSchema4 ? InferParamType<P[K]> : never }
        : T extends { type: 'array'; items: infer I }
          ? I extends JSONSchema4
            ? Array<InferParamType<I>>
            : never
          : never

type ToolParams<T extends Tool> = InferParamType<T['parameters']>

export interface IPage<
  T extends Tool = Tool,
  TResults extends Record<T['name'], unknown> = Record<T['name'], unknown>,
> {
  /**
   * Unique identifier for the page
   */
  readonly id: string

  /**
   * Display name of the page
   */
  readonly name: string

  /**
   * Get the instructions for the AI model
   * @returns Instructions string that defines the AI's behavior and personality
   */
  getInstructions(): string

  /**
   * Get the tools available for this page
   * @returns Array of tool definitions that the AI can use
   */
  getTools(): T[]

  /**
   * Run a tool with the given name and arguments
   * @param name The name of the tool to run
   * @param args The arguments to pass to the tool, typed based on the tool's parameters
   * @returns A promise that resolves to the tool's result type
   */
  runTool(name: string, args: unknown): Promise<unknown>
}

/**
 * Base class for implementing pages
 */
export abstract class PageBase<
  T extends Tool = Tool,
  TResults extends Record<T['name'], unknown> = Record<T['name'], unknown>,
> implements IPage<T, TResults>
{
  constructor(
    public readonly id: string,
    public readonly name: string
  ) {}

  abstract getInstructions(): string
  abstract getTools(): T[]
  abstract runTool<N extends T['name']>(
    name: N,
    args: ToolParams<Extract<T, { name: N }>>
  ): Promise<TResults[N]>
}
