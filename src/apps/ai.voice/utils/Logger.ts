export class Logger {
  private logsContainer: HTMLDivElement

  constructor(containerId: string) {
    this.logsContainer = document.querySelector<HTMLDivElement>(containerId)!
  }

  log(functionName: string, args: string, result?: unknown) {
    const logEntry = document.createElement('div')
    logEntry.className = 'log-entry'

    const timestamp = document.createElement('div')
    timestamp.className = 'timestamp'
    timestamp.textContent = new Date().toLocaleTimeString()

    const name = document.createElement('div')
    name.className = 'function-name'
    name.textContent = `Function: ${functionName}`

    const argsElement = document.createElement('pre')
    argsElement.textContent = `Arguments: ${args}`

    logEntry.appendChild(timestamp)
    logEntry.appendChild(name)
    logEntry.appendChild(argsElement)

    if (result !== undefined) {
      const resultElement = document.createElement('pre')
      resultElement.className = 'result'
      resultElement.textContent = `Result: ${JSON.stringify(result, null, 2)}`
      logEntry.appendChild(resultElement)
    }

    this.logsContainer.insertBefore(logEntry, this.logsContainer.firstChild)
    console.log('Function call:', functionName, args)
  }

  addError(error: unknown) {
    const lastEntry = this.logsContainer.firstChild as HTMLElement
    if (lastEntry) {
      const errorElement = document.createElement('pre')
      errorElement.className = 'result error'
      errorElement.textContent = `Error: ${error}`
      lastEntry.appendChild(errorElement)
    }
  }

  addResult(result: unknown) {
    const lastEntry = this.logsContainer.firstChild as HTMLElement
    if (lastEntry) {
      const resultElement = document.createElement('pre')
      resultElement.className = 'result'
      resultElement.textContent = `Result: ${JSON.stringify(result, null, 2)}`
      lastEntry.appendChild(resultElement)
    }
  }

  warn(message: string) {
    this.log('Warning', message)
  }
}
