import { eventAggregatorModule } from "./di/eventAggregatorModule";
import { EventAggregatorTypes } from "./di/EventAggregatorTypes";
import { EventAggregator } from "./EventAggregator";
import { IEventAggregator } from "./interfaces/IEventAggregator";
import { IPubSubEvent } from "./interfaces/IPubSubEvent";
import { ISubscription } from "./interfaces/ISubscription";

export { EventAggregatorTypes, eventAggregatorModule };
export type {EventAggregator, IEventAggregator, IPubSubEvent, ISubscription}