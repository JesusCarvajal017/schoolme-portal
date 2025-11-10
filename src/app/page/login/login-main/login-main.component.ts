import { Component, inject } from '@angular/core';

import {FormBuilder,  ReactiveFormsModule, Validators, AbstractControl, ValidationErrors} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {TuiInputModule} from '@taiga-ui/legacy';

import {TuiIcon, TuiTextfield, TuiError, TuiAlertService} from '@taiga-ui/core';
import {TuiPassword} from '@taiga-ui/kit';
import {TuiCardLarge,} from '@taiga-ui/layout';
import { AuthMainService } from '../../../service/auth/auth-main.service';
import { Router, RouterLink } from '@angular/router';
import { CredencialesUsuario } from '../../../global/dtos/seguridad';
import {TuiRoot} from '@taiga-ui/core';



@Component({
  selector: 'app-login-main',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiIcon, 
    TuiPassword, 
    TuiTextfield,
    TuiError,
    MatProgressSpinnerModule,
    TuiRoot, 
  ],
  templateUrl: './login-main.component.html',
  styleUrl: './login-main.component.css'
})
export class LoginMainComponent  {
  private readonly alerts = inject(TuiAlertService);
  securityauth = inject(AuthMainService); 
  router = inject(Router);
  isLoader = false;

  // Control del modal de recuperación
  mostrarModalRecuperar = false;
  pasoRecuperacion = 1; // 1: Ingresar email, 2: Ingresar código, 3: Nueva contraseña
  emailRecuperacion = "";
  errorCodigo = "";
  codigoVerificado = "";

  private formBuilder = inject(FormBuilder);

  form = this.formBuilder.group({
    email: ["", {validators: [Validators.required, Validators.email]}],
    password : ["", {validators: [Validators.required]}]
  });

  // Formulario para recuperar contraseña
  formRecuperar = this.formBuilder.group({
    email: ["", {validators: [Validators.required, Validators.email]}]
  });

  // Formulario para ingresar código de 5 dígitos
  formCodigo = this.formBuilder.group({
    digito1: ["", {validators: [Validators.required, Validators.pattern(/^[0-9]$/)]}],
    digito2: ["", {validators: [Validators.required, Validators.pattern(/^[0-9]$/)]}],
    digito3: ["", {validators: [Validators.required, Validators.pattern(/^[0-9]$/)]}],
    digito4: ["", {validators: [Validators.required, Validators.pattern(/^[0-9]$/)]}],
    digito5: ["", {validators: [Validators.required, Validators.pattern(/^[0-9]$/)]}]
  });

  // Formulario para nueva contraseña
  formNuevaPassword = this.formBuilder.group({
    password: ["", {
      validators: [
        Validators.required,
        Validators.minLength(8),
        this.validarPasswordSegura.bind(this)
      ]
    }],
    confirmarPassword: ["", {validators: [Validators.required]}]
  }, {
    validators: this.validarPasswordsCoinciden.bind(this)
  });

  /**
   * Validador personalizado para contraseña segura
   */
  validarPasswordSegura(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;

    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);

    if (!tieneMayuscula || !tieneNumero) {
      return { passwordDebil: true };
    }

    return null;
  }

  /**
   * Validador para verificar que las contraseñas coincidan
   */
  validarPasswordsCoinciden(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmarPassword = control.get('confirmarPassword')?.value;

    if (password && confirmarPassword && password !== confirmarPassword) {
      return { passwordsMismatch: true };
    }

    return null;
  }

  /**
   * Verifica si se cumple un requisito específico de la contraseña
   */
  cumpleRequisito(requisito: string): boolean {
    const password = this.formNuevaPassword.controls.password.value;
    if (!password) return false;

    switch(requisito) {
      case 'minLength':
        return password.length >= 8;
      case 'mayuscula':
        return /[A-Z]/.test(password);
      case 'numero':
        return /[0-9]/.test(password);
      default:
        return false;
    }
  }

  /**
   * Muestra una notificación de error cuando las credenciales son incorrectas
   */
  protected showNotification(): void {
    this.alerts
      .open('Las credenciales ingresadas son incorrectas. Por favor, verifica tu correo y contraseña.', {
        label: 'Acceso denegado',
        appearance: 'error',
        autoClose: 5000
      })
      .subscribe();
  }

  obtenerErrorEmail(): string {
    let email = this.form.controls.email;

    if(email.hasError('required')){
      return "Digite el correo electronico";
    }

    if(email.hasError('email')){
      return "Ingrese un correo electrónico válido";
    }

    return "";
  }

  obtenerErrorPassword(): string {
    let password = this.form.controls.password;

    if(password.hasError('required')){
      return "Digite la contraseña";
    }

    return "";
  }

  obtenerErrorEmailRecuperar(): string {
    let email = this.formRecuperar.controls.email;

    if(email.hasError('required')){
      return "Digite el correo electronico";
    }

    if(email.hasError('email')){
      return "Ingrese un correo electrónico válido";
    }

    return "";
  }

  obtenerErrorNuevaPassword(): string {
    let password = this.formNuevaPassword.controls.password;

    if(password.hasError('required')){
      return "Digite la contraseña";
    }

    if(password.hasError('minLength')){
      return "La contraseña debe tener al menos 8 caracteres";
    }

    if(password.hasError('passwordDebil')){
      return "La contraseña debe contener al menos una mayúscula y un número";
    }

    return "";
  }

  obtenerErrorConfirmarPassword(): string {
    let confirmar = this.formNuevaPassword.controls.confirmarPassword;

    if(confirmar.hasError('required')){
      return "Confirma tu contraseña";
    }

    return "";
  }

  /**
   * Abre el modal de recuperar contraseña
   */
  abrirRecuperarPassword(): void {
    this.mostrarModalRecuperar = true;
    this.pasoRecuperacion = 1;
    this.formRecuperar.reset();
  }

  /**
   * Cierra el modal de recuperar contraseña
   */
  cerrarRecuperarPassword(): void {
    this.mostrarModalRecuperar = false;
    this.pasoRecuperacion = 1;
    this.formRecuperar.reset();
    this.formCodigo.reset();
    this.formNuevaPassword.reset();
    this.errorCodigo = "";
    this.codigoVerificado = "";
  }

  /**
   * Vuelve al paso anterior
   */
  volverPasoAnterior(): void {
    this.pasoRecuperacion = 1;
    this.formCodigo.reset();
    this.errorCodigo = "";
  }

  /**
   * Envía el correo de recuperación y avanza al paso 2
   */
  enviarRecuperacion(): void {
    if(this.formRecuperar.invalid){
      this.formRecuperar.markAllAsTouched();
      return;
    }

    // TODO: Aquí implementarás la lógica de envío de correo con el código
    this.emailRecuperacion = this.formRecuperar.controls.email.value!;
    
    // Simula el envío exitoso y avanza al paso 2
    this.alerts
      .open(`Se ha enviado un código de verificación a ${this.emailRecuperacion}`, {
        label: 'Código enviado',
        appearance: 'success',
        autoClose: 4000
      })
      .subscribe();

    this.pasoRecuperacion = 2;
  }

  /**
   * Reenvía el código
   */
  reenviarCodigo(): void {
    // TODO: Implementar lógica de reenvío
    this.alerts
      .open('Se ha reenviado el código de verificación', {
        label: 'Código reenviado',
        appearance: 'info',
        autoClose: 3000
      })
      .subscribe();
    
    this.formCodigo.reset();
    this.errorCodigo = "";
  }

  /**
   * Verifica el código ingresado
   */
  verificarCodigo(): void {
    if(this.formCodigo.invalid){
      this.formCodigo.markAllAsTouched();
      this.errorCodigo = "Por favor, completa todos los dígitos del código";
      return;
    }

    const codigo = 
      (this.formCodigo.controls.digito1.value || '') +
      (this.formCodigo.controls.digito2.value || '') +
      (this.formCodigo.controls.digito3.value || '') +
      (this.formCodigo.controls.digito4.value || '') +
      (this.formCodigo.controls.digito5.value || '');

    // TODO: Aquí implementarás la lógica de verificación del código
    console.log('Código ingresado:', codigo);
    console.log('Email:', this.emailRecuperacion);

    // Simula verificación exitosa
    this.codigoVerificado = codigo;
    this.alerts
      .open('Código verificado correctamente', {
        label: '¡Éxito!',
        appearance: 'success',
        autoClose: 3000
      })
      .subscribe();

    // Avanza al paso 3
    this.pasoRecuperacion = 3;
  }

  /**
   * Establece la nueva contraseña
   */
  establecerNuevaPassword(): void {
    if(this.formNuevaPassword.invalid){
      this.formNuevaPassword.markAllAsTouched();
      return;
    }

    const nuevaPassword = this.formNuevaPassword.controls.password.value || '';

    // TODO: Aquí implementarás la lógica para actualizar la contraseña
    console.log('Email:', this.emailRecuperacion);
    console.log('Código verificado:', this.codigoVerificado);
    console.log('Nueva contraseña:', nuevaPassword);

    // Simula el restablecimiento exitoso
    this.alerts
      .open('Tu contraseña ha sido restablecida exitosamente', {
        label: '¡Contraseña actualizada!',
        appearance: 'success',
        autoClose: 4000
      })
      .subscribe();

    // Cierra el modal y limpia todo
    this.cerrarRecuperarPassword();
  }

  /**
   * Mueve el foco al siguiente input cuando se ingresa un dígito
   */
  moverSiguienteInput(event: any, siguienteInput: any): void {
    const valor = event.target.value;
    
    // Solo permite números
    if (!/^[0-9]$/.test(valor)) {
      event.target.value = '';
      return;
    }

    // Mueve al siguiente input si existe
    if (valor && siguienteInput) {
      siguienteInput.focus();
    }
  }

  /**
   * Maneja la tecla backspace para volver al input anterior
   */
  manejarBackspace(event: any, anteriorInput: any, inputActual: any): void {
    if (event.key === 'Backspace') {
      if (!inputActual.value && anteriorInput) {
        anteriorInput.focus();
      }
    }
  }

  loguear(){
    // Validar el formulario antes de enviar
    if(this.form.invalid){
      this.form.markAllAsTouched();
      return;
    }

    this.isLoader = true; 
    let capture = this.form.getRawValue(); 

    const data : CredencialesUsuario = {
        email: capture.email!,
        password : capture.password!
    }

    this.securityauth.login(data).subscribe({
      next: () => {
        this.isLoader = false;
        // Opcional: Mostrar mensaje de éxito
        this.alerts
          .open('Has iniciado sesión correctamente', {
            label: '¡Bienvenido!',
            appearance: 'success',
            autoClose: 3000
          })
          .subscribe();
        
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoader = false;
        console.error('Error en login:', err);
        this.showNotification();
      }
    });
  } 
}