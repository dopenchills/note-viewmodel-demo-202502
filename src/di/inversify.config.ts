import { Container } from 'inversify'
import 'reflect-metadata'
import { noteModule } from 'src/features/note/view-models/di/noteModule'
import { userModule } from 'src/features/user/view-models/di/userModule'
import { apiModule } from 'src/shared/api/di/apiModule'
import { eventAggregatorModule } from 'src/shared/event-aggregator/di/eventAggregatorModule'

const diContainer = new Container()
diContainer.load(apiModule, eventAggregatorModule, userModule, noteModule)

export { diContainer }
