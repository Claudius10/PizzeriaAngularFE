import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Button} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {Router} from '@angular/router';
import {AccountService} from '../../../../services/http/account/account.service';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {emailRgx, passwordRegex} from '../../../../regex';
import {LoginForm} from '../../../../interfaces/forms/account';
import {InputTextModule} from 'primeng/inputtext';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    Button,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule
  ],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginDialogComponent {
  private accountService = inject(AccountService);
  private router = inject(Router);
  private login = this.accountService.login();
  visible: boolean = false;

  form = new FormGroup({
    email: new FormControl<string>("", {
      validators: [Validators.pattern(emailRgx)],
      nonNullable: true,
      updateOn: 'blur'
    }),
    password: new FormControl<string>("", {
      validators: [Validators.pattern(passwordRegex)],
      nonNullable: true,
      updateOn: 'blur'
    }),
  });

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.log(this.form.controls);
      return;
    }

    const data: LoginForm = {
      email: this.form.get("email")!.value,
      password: this.form.get("password")!.value,
    };

    this.login.mutate(data, {
      onSuccess: () => {
        // notification
        this.router.navigate(["/menu/pizzas"]);
      },
      onError: () => {
      }
    });
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
  }
}