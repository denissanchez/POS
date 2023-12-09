import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Subscription, delay } from 'rxjs';
import { AuthService } from './auth.service';
import { CAN_VIEW_TRANSACTIONS, CAN_VIEW_USERS } from './shared/models/user';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {

  public canViewTransactions: boolean = false;
  public canViewUsers: boolean = false;

  private userSubscription!: Subscription;

  constructor(private authService: AuthService, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
    this.spinner.show();

    this.userSubscription = this.authService.user$.pipe(delay(1_000)).subscribe({
      next: (user) => {
        if (user) {
          this.spinner.hide();
        }
      }
    });

    this.authService.can(CAN_VIEW_TRANSACTIONS).subscribe({
      next: (can) => this.canViewTransactions = can,
    })

    this.authService.can(CAN_VIEW_USERS).subscribe({
      next: (can) => this.canViewUsers = can,
    })
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  logout() {
    window.location.href = '/logout';
  }
}
