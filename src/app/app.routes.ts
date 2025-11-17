import { Routes } from '@angular/router';
import { LadingPageComponent } from './page/security/person/lading-page/lading-page.component';
import { NotFoundComponent } from './page/not-found/not-found/not-found.component';
import { EditarPersonComponent } from './page/security/person/editar-person/editar-person.component';
import { LandingUserComponent } from './page/security/user/landing-user/landing-user.component';
import { CrearUserComponent } from './page/security/user/crear-user/crear-user.component';
import { EditarUserComponent } from './page/security/user/editar-user/editar-user.component';
import { LoginMainComponent } from './page/login/login-main/login-main.component';
import { UserCreateComponent } from './page/forms/user-create/user-create.component';
import { esAdminGuard } from './auth/guards/es-admin.guard';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { LandingRolComponent } from './page/security/rol/landing-rol/landing-rol.component';
import { LandingPermissionComponent } from './page/security/permission/landing-permission/landing-permission.component';
import { LandingModuleComponent } from './page/security/module/landing-module/landing-module.component';
import { LandingFormComponent } from './page/security/form/landing-form/landing-form.component';
import { LandingModuleFormComponent } from './page/security/module-form/landing-module-form/landing-module-form.component';
import { LandingUserRolComponent } from './page/security/user-rol/landing-user-rol/landing-user-rol.component';
import { LandingRolFormPermissionComponent } from './page/security/rol-form-permission/landing-rol-form-permission/landing-rol-form-permission.component';
import { LandingGradeComponent } from './page/paramaters/grade/landing-grade/landing-grade.component';
import { LandingDocumentTypeComponent } from './page/paramaters/document-type/landing-document-type/landing-document-type.component';
import { LandingEpsComponent } from './page/paramaters/eps/landing-eps/landing-eps.component';
import { LandingMunicipalityComponent } from './page/paramaters/municipality/landing-municipality/landing-municipality.component';
import { LandingGroupsComponent } from './page/paramaters/groups/landing-groups/landing-groups.component';
import { ProfileComponent } from './page/security/user/profile/profile/profile.component';
import { LandingHomeComponent } from './page/home/landing-home/landing-home.component';
import { LandingGroupDirectorComponent } from './page/business/group-director/landing-group-director/landing-group-director.component';
import { LandingAcademicLoadComponent } from './page/business/academic-load/landing-academic-load/landing-academic-load.component';
import { LandingStudentComponent } from './page/paramaters/student/landing-student/landing-student.component';
import { LandingTeacherComponent } from './page/paramaters/teacher/landing-teacher/landing-teacher.component';
import { AjustesSecurityComponent } from './page/security/user/ajustes-security/ajustes-security.component';
import { PanelComponent } from './page/home/panel/panel.component';
import { LandingComponent } from './page/home/landing-page/landing.component';
import { LandigPageComponent } from './page/paramaters/acudientes/landig-page/landig-page.component';
import { MiFamiliaComponent } from './page/paramaters/acudientes/mi-familia/mi-familia.component';


export const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    {
        path: '',
        component: LandingComponent
    },
    {
        path: 'login',
        component: LoginMainComponent
    },
    { path: 'register', component: UserCreateComponent},
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [esAdminGuard],
        children: [
            { path: '', component: LandingHomeComponent, canActivate: [esAdminGuard]  },
            { path: 'todos', component: LadingPageComponent, canActivate: [esAdminGuard]  },
            { path: 'todos/editar/:id', component: EditarPersonComponent, canActivate: [esAdminGuard]},
            { path: 'usuarios', component: LandingUserComponent , canActivate: [esAdminGuard]},
            { path: 'user/crear', component: CrearUserComponent},
            { path: 'user/editar/:id', component: EditarUserComponent},
            { path: 'roles', component: LandingRolComponent, canActivate: [esAdminGuard]},
            { path: 'permisos', component: LandingPermissionComponent, canActivate: [esAdminGuard]},
            { path: 'modulos', component: LandingModuleComponent, canActivate: [esAdminGuard]},
            { path: 'formularios', component: LandingFormComponent, canActivate: [esAdminGuard]},
            { path: 'asiganacionModulos', component: LandingModuleFormComponent, canActivate: [esAdminGuard]},
            { path: 'asignacionRoles', component: LandingUserRolComponent, canActivate: [esAdminGuard]},
            { path: 'asignacionPermisos', component: LandingRolFormPermissionComponent, canActivate: [esAdminGuard]},
            { path: 'grados', component: LandingGradeComponent, canActivate: [esAdminGuard]},
            { path: 'tipoIdentificacion', component: LandingDocumentTypeComponent, canActivate: [esAdminGuard]},
            { path: 'eps', component: LandingEpsComponent, canActivate: [esAdminGuard]},
            { path: 'municipio', component: LandingMunicipalityComponent, canActivate: [esAdminGuard]},
            { path: 'grupos', component: LandingGroupsComponent, canActivate: [esAdminGuard]},
            { path: 'perfil', component: ProfileComponent, canActivate: [esAdminGuard] },
            { path: 'ajustes-security', component: AjustesSecurityComponent },
            {path: 'directorGrupo', component: LandingGroupDirectorComponent, canActivate: [esAdminGuard]},
            {path: 'cargaAcademica', component: LandingAcademicLoadComponent, canActivate: [esAdminGuard]},
            {path: 'ninos', component: LandingStudentComponent, canActivate: [esAdminGuard]},
            {path: 'docentes' , component: LandingTeacherComponent, canActivate: [esAdminGuard]},
            {path: 'aulas' , component: LandingGroupsComponent, canActivate: [esAdminGuard ]},
            {path: 'agrupación' , component: LandingGradeComponent, canActivate: [esAdminGuard]},
            {path: 'cargaAcademica' , component: LandingAcademicLoadComponent, canActivate: [esAdminGuard]},
            
            {path: 'panel' , component: PanelComponent, canActivate: [esAdminGuard]},
            {path: 'acudientes' , component: LandigPageComponent, canActivate: [esAdminGuard]},
            {path: 'acudientes/mifamilia/:id' , component: MiFamiliaComponent, canActivate: [esAdminGuard]}


        ]
    },
    {path: '**', component: NotFoundComponent}      
    
];
