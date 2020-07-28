import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { userDetails } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: userDetails[]
  constructor( private authService: AuthService) { }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers() {
    this.authService.getUserDetails(null, true).subscribe( users => {
      this.users = users
      console.log(this.users)
    })
  }
}
