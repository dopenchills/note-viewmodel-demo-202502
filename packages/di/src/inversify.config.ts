import 'reflect-metadata'
import { Container } from 'inversify'
import { eventAggregatorModule } from '../../shared/event-aggregator/src'

const diContainer = new Container()
  .load(
    eventAggregatorModule,
  )

export { diContainer }
