import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "@app/shared/models/user";
import { Observable, map } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class UsersService {
    constructor(private http: HttpClient) {
    }

    public getAll(): Observable<User[]> {
        return this.http.get('/api/v1/users').pipe(
            map((users: any) => User.fromList(users))
        );
    }

    public registerUser(user: User) {
        return this.http.post('/api/v1/users', user.json());
    }
}
