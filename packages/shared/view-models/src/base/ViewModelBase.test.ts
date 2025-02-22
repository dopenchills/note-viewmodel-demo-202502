import { describe, it, expect } from 'vitest'
import { ViewModelBase } from './ViewModelBase'

// Concrete class for testing
class TestViewModel extends ViewModelBase {
  // Add any required abstract methods here if needed
}

describe('ViewModelBase', () => {
  const createViewModel = () => new TestViewModel()

  it('should have initial isBusy state as false', () => {
    const viewModel = createViewModel()
    expect(viewModel.isBusy).toBe(false)
  })

  it('should set isBusy to true', () => {
    const viewModel = createViewModel()
    viewModel.setIsBusy(true)
    expect(viewModel.isBusy).toBe(true)
  })

  it('should set isBusy to false', () => {
    const viewModel = createViewModel()
    viewModel.setIsBusy(true)
    viewModel.setIsBusy(false)
    expect(viewModel.isBusy).toBe(false)
  })
})
