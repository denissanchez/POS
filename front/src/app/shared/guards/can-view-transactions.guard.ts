import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../services/user.service";
import { CAN_VIEW_TRANSACTIONS } from "../models/user";


export const canViewTransactions: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(UserService).can(CAN_VIEW_TRANSACTIONS);
};
