import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "@app/shared/models/user";


@Injectable({
    providedIn: 'root'
})
export class UsersService {
    constructor(private http: HttpClient) {
    }

    public getAll() {
        return this.http.get('/api/v1/users');
    }

    public registerUser(user: User) {
        return this.http.post('/api/v1/users', user.json());
    }
}
