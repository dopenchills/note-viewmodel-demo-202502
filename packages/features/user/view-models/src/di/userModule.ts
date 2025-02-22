import { ContainerModule } from "inversify";
import { UserTypes } from "./UserTypes";
import { AuthViewModel } from "../impl/AuthViewModel";
import { SignInViewModel } from "../impl/SignInViewModel";
import { SignUpViewModel } from "../impl/SignUpViewModel";

export const userModule = new ContainerModule((bind) => {
  bind(UserTypes.AuthViewModel)
    .to(AuthViewModel)
    .inSingletonScope();
  
  bind(UserTypes.SignInViewModel)
    .to(SignInViewModel)

  bind(UserTypes.SignUpViewModel)
    .to(SignUpViewModel)
});
