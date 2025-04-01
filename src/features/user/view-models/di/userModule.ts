import { ContainerModule } from 'inversify'
import { AuthViewModel } from 'src/features/user/view-models/impl/AuthViewModel'
import { SignInViewModel } from 'src/features/user/view-models/impl/SignInViewModel'
import { SignOutViewModel } from 'src/features/user/view-models/impl/SignOutViewModel'
import { SignUpViewModel } from 'src/features/user/view-models/impl/SignUpViewModel'
import { UserTypes } from 'src/features/user/view-models/di/UserTypes'

export const userModule = new ContainerModule((bind) => {
  bind(UserTypes.AuthViewModel).to(AuthViewModel).inSingletonScope()

  bind(UserTypes.SignInViewModel).to(SignInViewModel)

  bind(UserTypes.SignUpViewModel).to(SignUpViewModel)

  bind(UserTypes.SignOutViewModel).to(SignOutViewModel)
})
