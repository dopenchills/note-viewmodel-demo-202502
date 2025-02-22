import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventAggregator } from './EventAggregator';
import { IPubSubEvent } from './interfaces/IPubSubEvent';

class TestEvent<P = string> implements IPubSubEvent<P> {
  constructor(public payload: P) {}
}

class NumberEvent<P = number> implements IPubSubEvent<P> {
  constructor(public payload: P) {}
}

describe('EventAggregator', () => {
  let eventAggregator: EventAggregator;
  let callback: (e: IPubSubEvent<string>) => Promise<void>;

  beforeEach(() => {
    eventAggregator = new EventAggregator();
    callback = vi.fn().mockResolvedValue(undefined);
  });

  describe('subscribe', () => {
    it('should return a subscription with unsubscribe method', () => {
      const subscription = eventAggregator.subscribe(TestEvent, callback);
      expect(subscription).toBeDefined();
      expect(subscription.unsubscribe).toBeTypeOf('function');
    });

    it('should allow multiple subscriptions to the same event', () => {
      const callback2 = vi.fn().mockResolvedValue(undefined);
      
      eventAggregator.subscribe(TestEvent, callback);
      eventAggregator.subscribe(TestEvent, callback2);
      
      const event = new TestEvent('test');
      eventAggregator.publish(event);
      
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('publish', () => {
    it('should call subscriber callback with event and data', () => {
      eventAggregator.subscribe(TestEvent, callback);
      const event = new TestEvent('test data');
      eventAggregator.publish(event);

      expect(callback).toHaveBeenCalledWith(event);
    });

    it('should handle multiple events independently', () => {
      const numberCallback = vi.fn().mockResolvedValue(undefined);

      eventAggregator.subscribe(TestEvent, callback);
      eventAggregator.subscribe(NumberEvent, numberCallback);

      const stringEvent = new TestEvent('string data');
      const numberEvent = new NumberEvent(42);
      
      eventAggregator.publish(stringEvent);
      eventAggregator.publish(numberEvent);

      expect(callback).toHaveBeenCalledWith(stringEvent);
      expect(numberCallback).toHaveBeenCalledWith(numberEvent);
    });

    it('should not fail when publishing to event with no subscribers', () => {
      expect(() => {
        const event = new TestEvent('test');
        eventAggregator.publish(event);
      }).not.toThrow();
    });

    it('should handle errors in callbacks without affecting other subscribers', async () => {
      const errorCallback = vi.fn().mockRejectedValue(new Error('Test error'));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      eventAggregator.subscribe(TestEvent, callback);
      eventAggregator.subscribe(TestEvent, errorCallback);
      
      const event = new TestEvent('test');
      eventAggregator.publish(event);
      
      // Wait for promises to resolve/reject
      await new Promise(resolve => setTimeout(resolve, 0));
      
      expect(callback).toHaveBeenCalled();
      expect(errorCallback).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('unsubscribe', () => {
    it('should remove subscriber from event', () => {
      eventAggregator.subscribe(TestEvent, callback);
      eventAggregator.unsubscribe(TestEvent, callback);
      
      const event = new TestEvent('test');
      eventAggregator.publish(event);
      
      expect(callback).not.toHaveBeenCalled();
    });

    it('should not affect other subscribers when unsubscribing', () => {
      const callback2 = vi.fn().mockResolvedValue(undefined);
      
      eventAggregator.subscribe(TestEvent, callback);
      eventAggregator.subscribe(TestEvent, callback2);
      
      eventAggregator.unsubscribe(TestEvent, callback);
      
      const event = new TestEvent('test');
      eventAggregator.publish(event);
      
      expect(callback).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it('should not fail when unsubscribing from non-existent event', () => {
      expect(() => {
        eventAggregator.unsubscribe(TestEvent, callback);
      }).not.toThrow();
    });

    it('should work through subscription object', () => {
      const subscription = eventAggregator.subscribe(TestEvent, callback);
      subscription.unsubscribe();
      
      const event = new TestEvent('test');
      eventAggregator.publish(event);
      
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
