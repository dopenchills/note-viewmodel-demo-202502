import { ContainerModule } from 'inversify'
import { EventAggregatorTypes } from 'src/shared/event-aggregator/di/EventAggregatorTypes'
import { EventAggregator } from 'src/shared/event-aggregator/EventAggregator'

export const eventAggregatorModule = new ContainerModule((bind) => {
  bind(EventAggregatorTypes.EventAggregator).to(EventAggregator).inSingletonScope()
})
