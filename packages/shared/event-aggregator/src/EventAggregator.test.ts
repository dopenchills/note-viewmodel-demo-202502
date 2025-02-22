import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EventAggregator } from './EventAggregator';
import { IPubSubEvent } from './interfaces/IPubSubEvent';

describe('EventAggregator', () => {
  let eventAggregator: EventAggregator;
  let testEvent: IPubSubEvent<string>;
  let callback: (e: IPubSubEvent<string>) => Promise<void>;

  beforeEach(() => {
    eventAggregator = new EventAggregator();
    testEvent = { payload: '' };
    callback = vi.fn().mockResolvedValue(undefined);
  });

  describe('subscribe', () => {
    it('should return a subscription with unsubscribe method', () => {
      const subscription = eventAggregator.subscribe(testEvent, callback);
      expect(subscription).toBeDefined();
      expect(subscription.unsubscribe).toBeTypeOf('function');
    });

    it('should allow multiple subscriptions to the same event', () => {
      const callback2 = vi.fn().mockResolvedValue(undefined);
      
      eventAggregator.subscribe(testEvent, callback);
      eventAggregator.subscribe(testEvent, callback2);
      
      eventAggregator.publish(testEvent, 'test');
      
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });
  });

  describe('publish', () => {
    it('should call subscriber callback with event and data', () => {
      eventAggregator.subscribe(testEvent, callback);
      eventAggregator.publish(testEvent, 'test data');

      expect(callback).toHaveBeenCalledWith({
        payload: 'test data'
      });
    });

    it('should handle multiple events independently', () => {
      const numberEvent: IPubSubEvent<number> = { payload: 0 };
      const numberCallback = vi.fn().mockResolvedValue(undefined);

      eventAggregator.subscribe(testEvent, callback);
      eventAggregator.subscribe(numberEvent, numberCallback);

      eventAggregator.publish(testEvent, 'string data');
      eventAggregator.publish(numberEvent, 42);

      expect(callback).toHaveBeenCalledWith(expect.objectContaining({
        payload: 'string data'
      }));
      expect(numberCallback).toHaveBeenCalledWith(expect.objectContaining({
        payload: 42
      }));
    });

    it('should not fail when publishing to event with no subscribers', () => {
      expect(() => {
        eventAggregator.publish(testEvent, 'test');
      }).not.toThrow();
    });

    it('should handle errors in callbacks without affecting other subscribers', async () => {
      const errorCallback = vi.fn().mockRejectedValue(new Error('Test error'));
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      eventAggregator.subscribe(testEvent, callback);
      eventAggregator.subscribe(testEvent, errorCallback);
      
      eventAggregator.publish(testEvent, 'test');
      
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
      eventAggregator.subscribe(testEvent, callback);
      eventAggregator.unsubscribe(testEvent, callback);
      
      eventAggregator.publish(testEvent, 'test');
      
      expect(callback).not.toHaveBeenCalled();
    });

    it('should not affect other subscribers when unsubscribing', () => {
      const callback2 = vi.fn().mockResolvedValue(undefined);
      
      eventAggregator.subscribe(testEvent, callback);
      eventAggregator.subscribe(testEvent, callback2);
      
      eventAggregator.unsubscribe(testEvent, callback);
      eventAggregator.publish(testEvent, 'test');
      
      expect(callback).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });

    it('should not fail when unsubscribing from non-existent event', () => {
      expect(() => {
        eventAggregator.unsubscribe(testEvent, callback);
      }).not.toThrow();
    });

    it('should work through subscription object', () => {
      const subscription = eventAggregator.subscribe(testEvent, callback);
      subscription.unsubscribe();
      
      eventAggregator.publish(testEvent, 'test');
      
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
