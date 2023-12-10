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

    public getById(_id: string): Observable<User> {
        return this.http.get(`/api/v1/users/${_id}`).pipe(
            map((res: any) => User.fromJSON(res))
        );
    }

    public registerUser(user: User) {
        return this.http.post('/api/v1/users', user.json());
    }

    public remove(_id: string) {
        return this.http.delete(`/api/v1/users/${_id}`);
    }
}
