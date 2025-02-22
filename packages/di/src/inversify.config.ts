import { userModule } from 'features__user__view-models'
import { Container } from 'inversify'
import 'reflect-metadata'
import { apiModule } from 'shared__api'
import { eventAggregatorModule } from '../../shared/event-aggregator/src'

const diContainer = new Container()
diContainer.load(apiModule, eventAggregatorModule, userModule)

export { diContainer }
