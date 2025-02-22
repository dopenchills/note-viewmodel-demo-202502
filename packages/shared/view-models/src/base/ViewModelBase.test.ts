import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ViewModelBase } from './ViewModelBase'
import { IEventAggregator, IPubSubEvent, ISubscription } from '../../../event-aggregator/src'

// Mock event aggregator
const createMockEventAggregator = () => {
  const mockSubscription: ISubscription = {
    unsubscribe: vi.fn()
  }
  
  return {
    subscribe: vi.fn().mockReturnValue(mockSubscription),
    mockSubscription
  }
}

// Concrete class for testing
class TestViewModel extends ViewModelBase {
  // Add any required abstract methods here if needed
}

describe('ViewModelBase', () => {
  let mockEa: ReturnType<typeof createMockEventAggregator>
  let viewModel: TestViewModel

  beforeEach(() => {
    mockEa = createMockEventAggregator()
    viewModel = new TestViewModel(mockEa as unknown as IEventAggregator)
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
      const mockEvent: IPubSubEvent<string> = { payload: 'test-event' }
      const mockCallback = async () => {}

      viewModel.subscribe(mockEa as unknown as IEventAggregator, mockEvent, mockCallback)

      expect(mockEa.subscribe).toHaveBeenCalledWith(mockEvent, mockCallback)
    })

    it('should store subscriptions for cleanup', async () => {
      const mockEvent: IPubSubEvent<string> = { payload: 'test-event' }
      const mockCallback = async () => {}

      viewModel.subscribe(mockEa as unknown as IEventAggregator, mockEvent, mockCallback)
      viewModel.unsubscribe()

      expect(mockEa.mockSubscription.unsubscribe).toHaveBeenCalled()
    })

    it('should unsubscribe from multiple subscriptions', async () => {
      const mockEvent1: IPubSubEvent<string> = { payload: 'test-event-1' }
      const mockEvent2: IPubSubEvent<string> = { payload: 'test-event-2' }
      const mockCallback = async () => {}

      viewModel.subscribe(mockEa as unknown as IEventAggregator, mockEvent1, mockCallback)
      viewModel.subscribe(mockEa as unknown as IEventAggregator, mockEvent2, mockCallback)
      viewModel.unsubscribe()

      expect(mockEa.mockSubscription.unsubscribe).toHaveBeenCalledTimes(2)
    })
  })
})
