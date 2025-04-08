import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { confirmPasswordValidator } from '../../validators/confirm-password.validator';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss'
})
export default class ResetComponent implements OnInit {
  resetForm !: FormGroup;
  fb = inject(FormBuilder);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  token!: string;

  ngOnInit(): void {

    this.resetForm = this.fb.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
      {
        validator: confirmPasswordValidator('password', 'confirmPassword')
      }

    );

    this.activatedRoute.params.subscribe(val => {
      this.token = val['token'];
      console.log(this.token);
    });

  }

  reset() {

  }

}
