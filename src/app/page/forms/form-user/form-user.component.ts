import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterLink, Router } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';

import { TuiHeader } from '@taiga-ui/layout';
import { TuiButton, TuiDataList, TuiError, TuiHint, TuiIcon, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiInputModule, TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { TuiDataListWrapper, TuiPassword, TuiTooltip } from '@taiga-ui/kit';

// Importar modelos y servicios
import { CreateModolUser2, User } from '../../../models/security/user.model';
import { Person, PersonOrigin } from '../../../models/security/person.model';
import { UserService } from '../../../service/user.service';
import { PersonService } from '../../../service/person.service';
import { AlertApp } from '../../../utilities/alert-taiga';

@Component({
  selector: 'app-form-user',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSlideToggleModule,
    TuiTitle,
    TuiHeader,
    TuiInputModule,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    TuiDataListWrapper,
    TuiDataList,
    TuiHint,
    MatIconModule,
    TuiIcon,
    TuiPassword,
    TuiTextfield,
    TuiButton,
    TuiError
  ],
  templateUrl: './form-user.component.html',
  styleUrl: './form-user.component.css'
})
export class FormUserComponent implements OnInit, OnChanges {

  // ======================= start entradas de componente =======================
  @Input({ required: true })
  title: string = '';

  @Input({ required: true })
  actionDescriptio!: string;

  @Input()
  model?: User;

  // ======================= end entradas de componente =======================

  // ======================= start salidas de componente =======================
  @Output()
  posteoForm = new EventEmitter<CreateModolUser2>();

  isChecked = true;
  
  servicePerson = inject(PersonService);
  personas: PersonOrigin[] = [];  


  // ======================= end salidas de componente =======================

  // =========================== start servicios ========================================
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly personService = inject(PersonService);
  private readonly alertService = inject(AlertApp);
  private readonly router = inject(Router);

  // =========================== end services ========================================

  // ================================== start propiedades ==================================
  
  // Listas para los dropdowns
  personList: PersonOrigin[] = [];
  loadingPersons = false;

  // crear un url temporal para mostrar imagen
  previewUrl: string | null = null;
  showDefaultAvatar: boolean = true;

  // funciona el select con esto
  personNameById = new Map<number, string>();

  // Helper importante
  idToNamePerson = (v: number | string | null | undefined): string => {
    if (v == null) return '';
    const id = typeof v === 'string' ? Number(v) : v;
    return this.personNameById.get(id) ?? '';
  };

  // ================================== end propiedades ==================================

  // ================================== start configuraciones de los formularios reactivos ==================================

  form = this.formBuilder.nonNullable.group({
    personId: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1)] }),
    email: ['', { validators: [Validators.required, Validators.email] }],
    password: ['', { validators: [Validators.required, Validators.minLength(8)] }],
    status: [true],
    photo: new FormControl<File | null>(null)
  });

  // ================================== end configuraciones de los formularios reactivos ==================================

  ngOnInit(): void {
    this.cargarPersonas();
  }

  ngOnChanges(): void {
    if (this.model) {
      let values = {
        personId: this.model.personId,
        email: this.model.email,
        password: '', // No cargar la contraseña por seguridad
        status: this.model.status == 1 ? true : false,
      }
      this.form.patchValue(values);

      // Si hay una foto existente, podrías cargarla aquí
      // this.previewUrl = this.model.photoUrl || null;
    }
  }

  // ================================== start métodos de carga de datos ==================================

  cargarPersonas(): void {
    this.loadingPersons = true;
    this.personService.obtenerTodos().subscribe({
      next: (data) => {
        this.personList = data;
        this.personNameById = new Map(
          this.personList.map(p => [
            p.id, 
            `${p.fisrtName} ${p.lastName} - ${p.identification}`
          ])
        );
        this.loadingPersons = false;
      },
      error: (err) => {
        console.error('Error cargando personas:', err);
        this.loadingPersons = false;
      }
    });
  }

  // ================================== end métodos de carga de datos ==================================

  // ================================== start manejo de archivos ==================================

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      console.log('Archivo seleccionado:', file); // Debug
      console.log('Tipo:', file.type); // Debug
      console.log('Tamaño:', file.size); // Debug
      
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        this.alertService.mensage = "Solo se permiten archivos de imagen (JPEG, JPG, PNG, GIF)";
        this.alertService.showDepositAlert();
        return;
      }

      // Validar tamaño de archivo (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        this.alertService.mensage = "El archivo es demasiado grande. Máximo 5MB";
        this.alertService.showDepositAlert();
        return;
      }

      // Crear URL para preview
      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl); // Limpiar URL anterior
      }
      
      this.previewUrl = URL.createObjectURL(file);
      this.showDefaultAvatar = false;
      
      // CRÍTICO: Asegurar que se guarde el File, no un string
      this.form.patchValue({ photo: file });
      console.log('FormControl photo value:', this.form.get('photo')?.value); // Debug
    }
  }

  removePhoto(): void {
    this.previewUrl = null;
    this.showDefaultAvatar = true;
    this.form.patchValue({ photo: null });
    
    // Limpiar el input file
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // ================================== end manejo de archivos ==================================

  // ================================== start validaciones y errores ==================================

  getEmailErrorMessage(): string {
    const emailControl = this.form.controls.email;
    
    if (emailControl.hasError('required')) {
      return 'El correo electrónico es requerido';
    }
    
    if (emailControl.hasError('email')) {
      return 'Ingrese un correo electrónico válido';
    }
    
    return '';
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.form.controls.password;
    
    if (passwordControl.hasError('required')) {
      return 'La contraseña es requerida';
    }
    
    if (passwordControl.hasError('minlength')) {
      return 'La contraseña debe tener al menos 8 caracteres';
    }
    
    return '';
  }

  getPersonErrorMessage(): string {
    const personControl = this.form.controls.personId;
    
    if (personControl.hasError('required')) {
      return 'Debe seleccionar una persona';
    }
    
    if (personControl.hasError('min')) {
      return 'Debe seleccionar una persona válida';
    }
    
    return '';
  }

  // ================================== end validaciones y errores ==================================

  // ================================== start métodos principales ==================================

  emitirValoresForm(): void {
    if (this.form.valid) {
      let capture = this.form.getRawValue();

      const dataUser: CreateModolUser2 = {
        id: this.model?.id || 0,
        personId: capture.personId ?? 0,
        email: capture.email,
        password: capture.password,
        status: capture.status ? 1 : 0,
        photo: capture.photo ?? undefined
      };

      this.posteoForm.emit(dataUser);
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  createUser(): void {
    if (this.form.valid) {
      let dataForm = this.form.getRawValue();

      const preData: CreateModolUser2 = {
        personId: dataForm.personId ?? 0,
        email: dataForm.email,
        password: dataForm.password,
        status: dataForm.status ? 1 : 0,
        photo: dataForm.photo ?? undefined
      };

      console.log('Datos a enviar:', preData); // Debug
      console.log('Tipo de photo:', typeof preData.photo); // Debug
      console.log('Es File?:', preData.photo instanceof File); // Debug

      this.userService.createUserComplete(preData).subscribe({
        next: (response) => {
          console.log('Usuario creado:', response); // Debug
          this.alertService.mensage = "Usuario creado exitosamente";
          this.alertService.showDepositAlert();
          this.router.navigate(['/dashboard/usuarios']);
        },
        error: (err) => {
          console.error('Error completo:', err); // Debug detallado
          console.error('Status:', err.status); // Debug
          console.error('Mensaje:', err.message); // Debug
          this.alertService.mensage = `Error al crear el usuario: ${err.error?.message || err.message}`;
          this.alertService.showDepositAlert();
        }
      });
    } else {
      this.markAllFieldsAsTouched();
      console.log('Formulario inválido:', this.form.errors); // Debug
    }
  }

  updateUser(): void {
    if (this.form.valid && this.model) {
      let dataForm = this.form.getRawValue();

      const updateData: CreateModolUser2 = {
        id: this.model.id,
        personId: dataForm.personId ?? 0,
        email: dataForm.email,
        password: dataForm.password || '', // Enviar vacío si no se cambió
        status: dataForm.status ? 1 : 0,
        photo: dataForm.photo ?? undefined
      };

      // Usar el método updateUserComplete para manejar archivos
      this.userService.updateUserComplete(this.model.id, updateData).subscribe({
        next: (response) => {
          this.alertService.mensage = "Usuario actualizado exitosamente";
          this.alertService.showDepositAlert();
          this.router.navigate(['/dashboard/usuarios']);
        },
        error: (err) => {
          console.error('Error actualizando usuario:', err);
          this.alertService.mensage = "Error al actualizar el usuario";
          this.alertService.showDepositAlert();
        }
      });
    } else {
      this.markAllFieldsAsTouched();
    }
  }

  guardarCambios(): void {
    if (this.model) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/usuarios']);
  }

  // ================================== end métodos principales ==================================

  // ================================== start getters de conveniencia ==================================

  get isEditMode(): boolean {
    return !!this.model;
  }

  get selectedPersonName(): string {
    const personId = this.form.get('personId')?.value;
    return this.idToNamePerson(personId);
  }

  // ================================== end getters de conveniencia ==================================
}