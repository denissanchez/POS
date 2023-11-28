import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { PERMISSION, User } from "../models/user";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'platform'
})
export class UserService {
  public _user = new BehaviorSubject<User | null>(null);

  public get user$(): Observable<User | null> {
    return this._user.asObservable();
  }

  public get user(): User | null {
    return this._user.value;
  }

  constructor(private http: HttpClient) {
    console.log("Hola")
    this.fetchUser();
  }

  private fetchUser() {
    this.http.get('/api/user', {
      withCredentials: true
    }).subscribe({
      next: (user: any) => {
        this._user.next(User.fromJSON(user))
      },
      error: (err: any) => {
        this._user.next(null);
      }
    });
  }

  can(permission: PERMISSION) {
    if (this.user === null) {
      return false;
    }

    return this.user.can(permission);
  }

  logout() {
    window.location.href = '/logout';
  }
}
