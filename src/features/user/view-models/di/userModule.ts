import { ContainerModule } from 'inversify'
import { AuthViewModel } from '../impl/AuthViewModel'
import { SignInViewModel } from '../impl/SignInViewModel'
import { SignOutViewModel } from '../impl/SignOutViewModel'
import { SignUpViewModel } from '../impl/SignUpViewModel'
import { UserTypes } from './UserTypes'

export const userModule = new ContainerModule((bind) => {
  bind(UserTypes.AuthViewModel).to(AuthViewModel).inSingletonScope()

  bind(UserTypes.SignInViewModel).to(SignInViewModel)

  bind(UserTypes.SignUpViewModel).to(SignUpViewModel)

  bind(UserTypes.SignOutViewModel).to(SignOutViewModel)
})
