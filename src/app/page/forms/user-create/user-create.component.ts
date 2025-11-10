import { Component, inject } from '@angular/core';

import {FormBuilder,  ReactiveFormsModule, Validators} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {TuiInputModule} from '@taiga-ui/legacy';

import {TuiIcon, TuiTextfield, TuiError, TuiAlertService} from '@taiga-ui/core';
import {TuiPassword} from '@taiga-ui/kit';
import {TuiCardLarge,} from '@taiga-ui/layout';
import { AuthMainService } from '../../../service/auth/auth-main.service';
import { Router,RouterLink } from '@angular/router';
import { CredencialesUsuario } from '../../../global/dtos/seguridad';
import {TuiRoot} from '@taiga-ui/core';

@Component({
  selector: 'app-user-create',
  imports:  [
    ReactiveFormsModule,
    TuiInputModule, 
    TuiIcon, 
    TuiPassword, 
    TuiTextfield,
    TuiCardLarge,
    // TuiError,
    MatProgressSpinnerModule,
    TuiRoot,
    RouterLink
  ],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent {



  
}
