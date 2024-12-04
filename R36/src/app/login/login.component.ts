import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'fp-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent {
    username: string = '';
    password: string = '';
    errorMessage: string | null = null;

    constructor(private router: Router, private http: HttpClient) {}

    onLogin() {
      const data = {
          username: this.username,
          password: this.password,
      };

      //this.http.post<{ success: boolean, token: string }>('http://localhost:3000/api/login', data)
      this.http.post<{ success: boolean, token: string }>('http://143.198.11.24:3000/api/login', data)
          .subscribe(res => {
              if (res && res.success) {
                  const token = res.token;
                  localStorage.setItem('jwt', token);
                  this.router.navigate(['/dashboard']);
              } else {
                  this.errorMessage = "Invalid username or password.";
              }
          }, error => {
              this.errorMessage = "Invalid username or password.";
              console.error(error);
          });
  }

}
