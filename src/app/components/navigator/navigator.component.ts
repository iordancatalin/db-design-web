import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { timer, of } from 'rxjs';
import { AuthenticationService } from 'src/app/services/security/authentication.service';
import { Router } from '@angular/router';
import { EventUtil } from 'src/app/class/ui/event-util';
import { NavService } from 'src/app/services/nav.service';
import { NotificationWrapper } from 'src/app/class/wrappers/notification-wrapper';
import { NotificationService } from 'src/app/services/notification.service';

class NavOption {
  constructor(
    public _name: string,
    public _routerLink: string,
    public _icon: string,
    public _active: boolean = false
  ) {}
}

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.scss']
})
export class NavigatorComponent implements OnInit {
  @Output() private atToggleShowMenu = new EventEmitter<boolean>();

  private extendedMenu = true;
  private showMenu = true;
  private imgOptions = false;

  showNotifications = false;
  _navOptions: Array<NavOption>;

  private notifications: Array<NotificationWrapper> = [];

  constructor(
    private _authenticationService: AuthenticationService,
    private _router: Router,
    private _navService: NavService,
    private _notificationService: NotificationService
  ) {}

  ngOnInit() {
    this._navOptions = [];

    this._navOptions.push(
      new NavOption('Playground', '/master/workshop', 'process.svg')
    );
    this._navOptions.push(
      new NavOption('Storage', '/master/storage', 'database.svg', true)
    );
    this._navOptions.push(
      new NavOption('Shared with me', '/master/shared', 'friends.svg')
    );
    this._navOptions.push(
      new NavOption('Profile', '/master/profile', 'avatar.svg')
    );

    this._navService.subject.subscribe(val => this.setCurrentNavOption(val));
    this._notificationService
      .getCurrentAccountNotifications()
      .subscribe(val => {
        this.notifications = val
          .filter(wrapper => !wrapper.notification.viewed)
          .filter(
            wrapper =>
              wrapper.notification.receiver ===
              this._authenticationService.getAuthenticatedAccount().email
          );
      });
  }

  private setCurrentNavOption(path: string): void {
    of(path).subscribe((val: string) => {
      const position = this._navOptions.findIndex(option =>
        val.includes(option._routerLink)
      );

      if (position !== -1) {
        this._navOptions.forEach(option => (option._active = false));
        this._navOptions[position]._active = true;
      }
    });
  }

  public toggleShowMenu() {
    this.showMenu = !this.showMenu;

    this.atToggleShowMenu.emit(this.showMenu);

    if (!this.showMenu) {
      this.extendedMenu = false;
    } else {
      timer(300).subscribe(() => (this.extendedMenu = true));
    }
  }

  private viewNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  private stopEvent(event: Event): void {
    EventUtil.stopEvent(event);
  }

  public signOut(event: MouseEvent): void {
    EventUtil.stopEvent(event);
    this._authenticationService
      .signOut()
      .subscribe(() => this._router.navigateByUrl('/'));
  }

  private hideImgOptions() {
    this.imgOptions = false;
  }

  public imgBlur(event: FocusEvent): void {
    this.imgOptions = false;
  }

  public toggleImgOptions(event: MouseEvent): void {
    this.imgOptions = !this.imgOptions;
  }

  private closeNotifications(): void {
    this.showNotifications = false;
  }
}
