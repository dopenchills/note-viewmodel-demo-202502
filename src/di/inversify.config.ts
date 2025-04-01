import { noteModule } from 'src/features/note/view-models'
import { userModule } from 'src/features/user/view-models'
import { Container } from 'inversify'
import 'reflect-metadata'
import { apiModule } from 'src/shared/api'
import { eventAggregatorModule } from 'src/shared/event-aggregator'

const diContainer = new Container()
diContainer.load(apiModule, eventAggregatorModule, userModule, noteModule)

export { diContainer }
