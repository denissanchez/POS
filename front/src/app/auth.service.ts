import { Injectable } from "@angular/core";
import { Observable, from, map, mergeMap, of, tap } from "rxjs";
import { PERMISSION, User } from "./shared/models/user";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // @ts-ignore
    private _user: User;

    public getCurrentUser(): Observable<User> {
        if (this._user) {
            return of(this._user);
        }

        return from(fetch("/user", {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })).pipe(
            mergeMap((res) => from(res.json())),
            map((res: any) => User.fromJSON(res)),
            tap((user) => this._user = user),
        );
    }

    public can(permission: PERMISSION): Observable<boolean> {
        return this.getCurrentUser().pipe(map((user) => user.can(permission)));
    }
}
