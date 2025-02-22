import { ContainerModule } from 'inversify'
import { EventAggregatorTypes } from './EventAggregatorTypes'
import { EventAggregator } from '../EventAggregator'

export const eventAggregatorModule = new ContainerModule((bind) => {
  bind(EventAggregatorTypes.EventAggregator).to(EventAggregator).inSingletonScope()
})
