import 'reflect-metadata'
import { Container } from 'inversify'
import { eventAggregatorModule } from '../../shared/event-aggregator/src'
import { userModule } from 'features__user__view-models'

const diContainer = new Container()
diContainer.load(eventAggregatorModule, userModule)

export { diContainer }
