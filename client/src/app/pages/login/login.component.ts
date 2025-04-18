import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  loginForm !: FormGroup;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: ["", Validators.required],
    }
    );
  }

  login() {
    console.log(this.loginForm.value);
    this.authService.loginService(this.loginForm.value).subscribe({
      next: (res) => {
        alert('Login is Successful');
        this.loginForm.reset();
        this.router.navigate(['home']);
      },
      error: (err)=>{
        console.log(err);
      }
    })
/*     this.authService.registerService(this.loginForm.value)
    .subscribe({
      next: (res) => {
        alert('Login Successful');
        this.loginForm.reset();
        this.router.navigate(['login']);
      },
      error: (err) => {
        console.log(err)
      }
    }); */
  }
}
