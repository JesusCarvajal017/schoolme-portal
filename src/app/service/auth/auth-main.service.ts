import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CredencialesUsuario, RespondAuth } from '../../global/dtos/seguridad';
import { Observable, tap, firstValueFrom, catchError, throwError } from 'rxjs';
import { jwtDecode } from "jwt-decode";
import { UserService } from '../user.service';

// Interface para el usuario decodificado del JWT
interface DecodedToken {
  id: number;
  email: string;
  personId?: number;
  rol?: string; 
  exp: number;
  iat: number;
  [key: string]: any;
}

// Interface para el usuario actual
export interface CurrentUser {
  id: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthMainService {

  // **************** servicios ****************
  private http = inject(HttpClient);
  private urlBase = environment.apiUrl;
  private userServices = inject(UserService);

  // ***************** Claves para localStorage *****************
  private readonly llaveToken = 'toke';
  private readonly llaveExpiracion = 'token-expiracion';
  private readonly llaveRol = 'user-rol';
  private readonly llaveUsuario = 'current-user';


  // Metodo principal, da acceso a toda la plataforma, consulta al back si el usuario es aceptado
  login(credenciales: CredencialesUsuario): Observable<RespondAuth> {

    // enpoint al cual apunta para iniciar sesión
    return this.http.post<RespondAuth>(`${this.urlBase}/Auth`, credenciales)
      .pipe(
        tap(responseAuth => {
          try {
            console.log('responseAuth recibido:', responseAuth);

            // ===== VALIDACIÓN CRÍTICA: Verificar que el token existe y es válido =====
            if (!responseAuth || !responseAuth.token || typeof responseAuth.token !== 'string') {
              throw new Error('Respuesta inválida del servidor');
            }

            // desencriptando informacion del claims de jwt backend
            const descodificado: DecodedToken = jwtDecode(responseAuth.token);
            let id = Number(descodificado.id);

            console.log('Token decodificado:', descodificado);

            // Guardar el rol del token
            if (descodificado.rol) {
              this.guardarRol(descodificado.rol);
            }

            // ========================= Guardar token y datos del usuario =========================

            // ********** guardar el token localstorage **********
            this.guardaToken(responseAuth);

            // ********** guardar usuario actual **********
            this.guardarUsuarioActual(id);

            // obteniendo informacion del usuario quien se registra
            this.userServices.obtenerPorId(id).subscribe({
              next: (data) => {
                // tu lógica existente aquí
              },
              error: (err) => {
                console.error('Error obteniendo información del usuario:', err);
              }
            });

          } catch (error) {
            console.error('Error procesando autenticación:', error);
            // Limpiar cualquier dato que se haya guardado
            this.logout();
            // Re-lanzar el error para que lo capture el componente
            throw error;
          }
        }),
        catchError(error => {
          console.error('Error en login:', error);
          // Asegurar que el error llegue al componente
          return throwError(() => new Error('Credenciales incorrectas'));
        })
      );
  }

  // ************** Guardar token en localStorage **************
  public guardaToken(authReponde: RespondAuth) {
    localStorage.setItem(this.llaveToken, authReponde.token);
    localStorage.setItem(this.llaveExpiracion, authReponde.expiracion.toString());
  }

  // Guardar datos del usuario actual
  private guardarUsuarioActual(idUser: number) {
    // guadando en el localstorage el id del usuario
    localStorage.setItem(this.llaveUsuario, idUser.toString());
  }

  //  Guardar el rol
  private guardarRol(rol: string) {
    localStorage.setItem(this.llaveRol, rol);
  }

  // Verificar si está logueado
  estalogeado(): boolean {
    const token = localStorage.getItem(this.llaveToken);
    const expiracion = localStorage.getItem(this.llaveExpiracion);
    
    if (!token || !expiracion) {
      return false;
    }
    
    const expiracionFecha = new Date(expiracion);
    
    if (expiracionFecha <= new Date()) {
      this.logout();
      return false;
    }
    
    return true;
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem(this.llaveToken);
    localStorage.removeItem(this.llaveExpiracion);
    localStorage.removeItem(this.llaveRol);
    localStorage.removeItem(this.llaveUsuario);
  }

  // Obtener token
  obtenerToken(): string | null {
    return localStorage.getItem(this.llaveToken);
  }

  // Obtener ID del usuario
  obtenerIdUser(): number {
    return Number(localStorage.getItem(this.llaveUsuario));
  }

  // Obtener el rol como número
  obtenerRolId(): number {
    const rol = localStorage.getItem(this.llaveRol);
    return rol ? Number(rol) : 1; // Por defecto 1 si no existe
  }

  // Obtener el rol como string (por si lo necesitas)
  obtenerRol(): string | null {
    return localStorage.getItem(this.llaveRol);
  }

  async obtenerIdPerson(): Promise<number> {
    try {
      const data = await firstValueFrom(
        this.userServices.obtenerPorId(this.obtenerIdUser())
      );

      return data?.personId ?? 0;
      
    } catch (err) {
      console.error(err);
      return 0;
    }
  }
}