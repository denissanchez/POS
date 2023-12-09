import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class UsersService {
    constructor(private http: HttpClient) {
    }

    public registerUser(user: any) {
        return this.http.post('/api/users', user);
    }
}
