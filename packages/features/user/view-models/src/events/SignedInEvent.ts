import { IPubSubEvent } from "shared__event-aggregator";

export interface SignedInPayload {
  name: string;
  email: string;
  password: string;
}

export class SignedInEvent implements IPubSubEvent<SignedInPayload> {
  constructor(public payload: SignedInPayload) {}
}
