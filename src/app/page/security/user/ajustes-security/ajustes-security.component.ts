import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserService } from '../../../../service/user.service';
import { AuthMainService } from '../../../../service/auth/auth-main.service';

@Component({
  selector: 'app-ajustes-security',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ajustes-security.component.html',
  styleUrls: ['./ajustes-security.component.css']
})
export class AjustesSecurityComponent {
  passwordForm: FormGroup;
  emailForm: FormGroup;
  loadingPassword = false;
  loadingEmail = false;

  // Modal de resultado
  showResultModal = false;
  modalMessage = '';
  modalType: 'success' | 'error' | 'warning' = 'success';

  // Modal de confirmación
  showConfirmModal = false;
  confirmAction: 'email' | 'password' | null = null;
  confirmMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthMainService,
    private userService: UserService
  ) {
    this.passwordForm = this.fb.group({
      passwordNew: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/)
        ]
      ],
      passwordConfirm: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  private passwordsMatch(group: FormGroup) {
    const pass = group.get('passwordNew')?.value;
    const confirm = group.get('passwordConfirm')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  // ============ MODALES ============
  
  private openResultModal(message: string, type: 'success' | 'error' | 'warning') {
    this.modalMessage = message;
    this.modalType = type;
    this.showResultModal = true;
  }

  closeResultModal() {
    this.showResultModal = false;
  }

  private openConfirmModal(message: string, action: 'email' | 'password') {
    this.confirmMessage = message;
    this.confirmAction = action;
    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
    this.confirmAction = null;
  }

  confirmActionHandler() {
    if (this.confirmAction === 'password') {
      this.executePasswordChange();
    } else if (this.confirmAction === 'email') {
      this.executeEmailChange();
    }
    this.closeConfirmModal();
  }

  // ============ CAMBIAR CONTRASEÑA ============

  submitPassword(): void {
    // Marcar todos los campos como touched para mostrar errores
    Object.keys(this.passwordForm.controls).forEach(key => {
      this.passwordForm.get(key)?.markAsTouched();
    });

    if (this.passwordForm.invalid) {
      // Mensajes específicos según el error
      if (this.passwordForm.get('passwordNew')?.hasError('required') || 
          this.passwordForm.get('passwordConfirm')?.hasError('required')) {
        this.openResultModal('⚠️ Por favor completa todos los campos de contraseña', 'warning');
        return;
      }

      if (this.passwordForm.get('passwordNew')?.hasError('minlength')) {
        this.openResultModal('⚠️ La contraseña debe tener al menos 8 caracteres', 'warning');
        return;
      }

      if (this.passwordForm.get('passwordNew')?.hasError('pattern')) {
        this.openResultModal('⚠️ La contraseña debe contener al menos una mayúscula y un carácter especial', 'warning');
        return;
      }

      if (this.passwordForm.hasError('mismatch')) {
        this.openResultModal('⚠️ Las contraseñas no coinciden', 'warning');
        return;
      }

      this.openResultModal('⚠️ Por favor verifica los campos del formulario', 'warning');
      return;
    }

    // Solicitar confirmación antes de cambiar
    this.openConfirmModal(
      '🔒 ¿Estás seguro de que deseas cambiar tu contraseña?\n\nEsta acción actualizará tu contraseña de acceso. Por seguridad, te recomendamos cerrar sesión en otros dispositivos después del cambio.',
      'password'
    );
  }

  private executePasswordChange(): void {
    const idUser = this.auth.obtenerIdUser();
    if (!idUser) {
      this.openResultModal('❌ No se encontró el usuario autenticado. Por favor inicia sesión nuevamente.', 'error');
      return;
    }

    const { passwordNew, passwordConfirm } = this.passwordForm.value;

    this.loadingPassword = true;
    this.userService.changePassword(idUser, passwordNew, passwordConfirm).subscribe({
      next: ok => {
        this.loadingPassword = false;
        if (ok) {
          this.passwordForm.reset();
          // Marcar como pristine y untouched para limpiar validaciones
          Object.keys(this.passwordForm.controls).forEach(key => {
            this.passwordForm.get(key)?.markAsUntouched();
            this.passwordForm.get(key)?.markAsPristine();
          });
          
          this.openResultModal(
            '✅ ¡Contraseña actualizada correctamente!',
            'success'
          );  
        } else {
          this.openResultModal('❌ No se pudo cambiar la contraseña. Por favor intenta nuevamente.', 'error');
        }
      },
      error: err => {
        this.loadingPassword = false;
        console.error('Error al cambiar contraseña:', err);
        
        let errorMessage = '❌ Error al cambiar la contraseña';
        
        // Mensajes específicos según el código de error
        if (err.status === 400) {
          errorMessage = '❌ La contraseña no cumple con los requisitos de seguridad';
        } else if (err.status === 401) {
          errorMessage = '❌ No tienes autorización para realizar esta acción. Por favor inicia sesión nuevamente.';
        } else if (err.status === 403) {
          errorMessage = '❌ Acceso denegado. Verifica tus credenciales.';
        } else if (err.status === 500) {
          errorMessage = '❌ Error del servidor. Por favor intenta más tarde.';
        } else if (err.message) {
          errorMessage = `❌ ${err.message}`;
        }
        
        this.openResultModal(errorMessage, 'error');
      }
    });
  }

  // ============ CAMBIAR CORREO ============

  async submitEmail() {
    // Marcar el campo como touched para mostrar errores
    this.emailForm.get('email')?.markAsTouched();

    if (this.emailForm.invalid) {
      if (this.emailForm.get('email')?.hasError('required')) {
        this.openResultModal('⚠️ Por favor ingresa un correo electrónico', 'warning');
        return;
      }

      if (this.emailForm.get('email')?.hasError('email')) {
        this.openResultModal('⚠️ Por favor ingresa un correo electrónico válido (ejemplo: usuario@dominio.com)', 'warning');
        return;
      }

      this.openResultModal('⚠️ Por favor verifica el formato del correo electrónico', 'warning');
      return;
    }

    const newEmail = this.emailForm.value.email;
    
    // Solicitar confirmación antes de cambiar
    this.openConfirmModal(
      `¿Estás seguro de que deseas cambiar tu correo electrónico?\n\nNuevo correo: ${newEmail}\n\nUna vez confirmado, enviaremos un mensaje de verificación a tu nueva dirección de correo.`,
      'email'
    );
  }

  private async executeEmailChange() {
    const idUser = this.auth.obtenerIdUser();
    const personId = await this.auth.obtenerIdPerson();

    if (!idUser || !personId) {
      this.openResultModal('❌ No se encontró el usuario o persona autenticada. Por favor inicia sesión nuevamente.', 'error');
      return;
    }

    const email = this.emailForm.value.email;

    this.loadingEmail = true;
    this.userService.updateUserEmail(idUser, email, personId, 1).subscribe({
      next: updated => {
        this.loadingEmail = false;
        this.emailForm.reset();
        // Marcar como pristine y untouched para limpiar validaciones
        this.emailForm.get('email')?.markAsUntouched();
        this.emailForm.get('email')?.markAsPristine();
        
        this.openResultModal(
          `✅ ¡Correo actualizado correctamente!\n\nTu correo electrónico ha sido actualizado a:\n${email}\n\nPor favor revisa tu bandeja de entrada para verificar tu nueva dirección de correo. Si no recibes el correo en unos minutos, revisa la carpeta de spam.`,
          'success'
        );
      },
      error: err => {
        this.loadingEmail = false;
        console.error('Error al actualizar correo:', err);
        
        let errorMessage = '❌ Error al actualizar el correo electrónico';
        
        // Mensajes específicos según el código de error
        if (err.status === 409) {
          errorMessage = '❌ Este correo electrónico ya está en uso por otra cuenta';
        } else if (err.status === 400) {
          errorMessage = '❌ El correo electrónico no es válido';
        } else if (err.status === 401) {
          errorMessage = '❌ No tienes autorización para realizar esta acción. Por favor inicia sesión nuevamente.';
        } else if (err.status === 403) {
          errorMessage = '❌ Acceso denegado. Verifica tus credenciales.';
        } else if (err.status === 500) {
          errorMessage = '❌ Error del servidor. Por favor intenta más tarde.';
        } else if (err.message) {
          errorMessage = `❌ ${err.message}`;
        }
        
        this.openResultModal(errorMessage, 'error');
      }
    });
  }
}