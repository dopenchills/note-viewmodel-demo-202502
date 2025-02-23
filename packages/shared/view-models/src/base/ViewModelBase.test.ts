import { IEventAggregator, IPubSubEvent, ISubscription } from 'shared__event-aggregator'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ViewModelBase } from './ViewModelBase'

// Mock event class for testing
class TestEvent implements IPubSubEvent<string> {
  constructor(public payload: string) {}
}

// Mock event aggregator
const createMockEventAggregator = () => {
  const mockSubscription: ISubscription = {
    unsubscribe: vi.fn(),
  }

  const mockEa: IEventAggregator = {
    subscribe: vi.fn().mockReturnValue(mockSubscription),
    unsubscribe: vi.fn(),
    publish: vi.fn(),
  }

  return {
    eventAggregator: mockEa,
    mockSubscription,
  }
}

// Concrete class for testing
class TestViewModel extends ViewModelBase {
  constructor(ea: IEventAggregator) {
    super(ea)
  }
}

describe('ViewModelBase', () => {
  let mockEa: ReturnType<typeof createMockEventAggregator>
  let viewModel: TestViewModel

  beforeEach(() => {
    mockEa = createMockEventAggregator()
    viewModel = new TestViewModel(mockEa.eventAggregator)
  })

  describe('isBusy state', () => {
    it('should have initial isBusy state as false', () => {
      expect(viewModel.isBusy).toBe(false)
    })

    it('should set isBusy to true', () => {
      viewModel.setIsBusy(true)
      expect(viewModel.isBusy).toBe(true)
    })

    it('should set isBusy to false', () => {
      viewModel.setIsBusy(true)
      viewModel.setIsBusy(false)
      expect(viewModel.isBusy).toBe(false)
    })
  })

  describe('event subscription', () => {
    it('should subscribe to events through event aggregator', async () => {
      const mockCallback = async () => {}

      viewModel.subscribe(TestEvent, mockCallback)

      expect(mockEa.eventAggregator.subscribe).toHaveBeenCalledWith(TestEvent, mockCallback)
    })

    it('should store subscriptions for cleanup', async () => {
      const mockCallback = async () => {}

      viewModel.subscribe(TestEvent, mockCallback)
      viewModel.unsubscribe()

      expect(mockEa.mockSubscription.unsubscribe).toHaveBeenCalled()
    })

    it('should unsubscribe from multiple subscriptions', async () => {
      const mockCallback = async () => {}

      viewModel.subscribe(TestEvent, mockCallback)
      viewModel.subscribe(TestEvent, mockCallback)
      viewModel.unsubscribe()

      expect(mockEa.mockSubscription.unsubscribe).toHaveBeenCalledTimes(2)
    })
  })

  describe('lifecycle methods', () => {
    it('should handle load', async () => {
      await expect(viewModel.load()).resolves.toBeUndefined()
    })

    it('should handle unload and unsubscribe', async () => {
      const mockCallback = async () => {}
      viewModel.subscribe(TestEvent, mockCallback)

      await viewModel.unload()

      expect(mockEa.mockSubscription.unsubscribe).toHaveBeenCalled()
    })
  })
})
