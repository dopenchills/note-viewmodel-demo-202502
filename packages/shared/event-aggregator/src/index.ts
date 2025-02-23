import { eventAggregatorModule } from './di/eventAggregatorModule'
import { EventAggregatorTypes } from './di/EventAggregatorTypes'
import { EventAggregator } from './EventAggregator'
import type { IEventAggregator } from './interfaces/IEventAggregator'
import type { IPubSubEvent } from './interfaces/IPubSubEvent'
import type { ISubscription } from './interfaces/ISubscription'

export { eventAggregatorModule, EventAggregatorTypes }
export type { EventAggregator, IEventAggregator, IPubSubEvent, ISubscription }
