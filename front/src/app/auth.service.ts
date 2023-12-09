import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, from, map, mergeMap, of, tap } from "rxjs";
import { PERMISSION, User } from "./shared/models/user";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _user: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);

    get user$(): Observable<User | undefined> {
        return this._user.asObservable();
    }

    public getCurrentUser(): Observable<User> {
        if (this._user.value) {
            return <Observable<User>>(this._user.asObservable());
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
            tap((user) => this._user.next(user)),
        );
    }

    public can(permission: PERMISSION): Observable<boolean> {
        return this.getCurrentUser().pipe(map((user) => user.can(permission)));
    }
}
