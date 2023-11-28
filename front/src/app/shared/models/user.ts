export type PERMISSION =  "CAN_VIEW_USERS" | "CAN_CREATE_USERS" | "CAN_REMOVE_USERS" | "CAN_UPDATE_USERS" | "CAN_VIEW_TRANSACTIONS" | "CAN_VIEW_METRICS";

export const CAN_VIEW_USERS: PERMISSION = "CAN_VIEW_USERS";
export const CAN_CREATE_USERS: PERMISSION = "CAN_CREATE_USERS";
export const CAN_REMOVE_USERS: PERMISSION = "CAN_REMOVE_USERS";
export const CAN_UPDATE_USERS: PERMISSION = "CAN_UPDATE_USERS";
export const CAN_VIEW_TRANSACTIONS: PERMISSION = "CAN_VIEW_TRANSACTIONS";
export const CAN_VIEW_METRICS: PERMISSION = "CAN_VIEW_METRICS";


export class User {
  public password: string = "";

  constructor(public _id: string | undefined = undefined, public name: string, public username: string, public permissions: PERMISSION[] = []) {
  }

  can(permission: PERMISSION) {
    return this.permissions.includes(permission);
  }

  setPassword(password: string) {
    this.password = password;
  }

  public static fromJSON(json: any): User {
    return new User(json._id, json.name, json.username, json.permissions);
  }
}

