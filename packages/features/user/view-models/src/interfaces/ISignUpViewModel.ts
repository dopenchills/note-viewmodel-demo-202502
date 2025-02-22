import { IViewModel, ObservableProps } from "shared__view-models";

export interface ISignUpViewModelProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ISignUpViewModel extends IViewModel, ObservableProps<ISignUpViewModelProps> {
  setName(name: string): void;
  setEmail(email: string): void;
  setPassword(password: string): void;
  setConfirmPassword(confirmPassword: string): void;
  signUp(): void;
}
