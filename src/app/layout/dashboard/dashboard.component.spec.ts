import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard.component';
import { SidebarService } from '../../service/sidebar.service';
import { SidebarItem } from '../../models/sidebar-item.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockSidebarService: jasmine.SpyObj<SidebarService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const sidebarServiceSpy = jasmine.createSpyObj('SidebarService', ['getSidebarItems']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: SidebarService, useValue: sidebarServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    mockSidebarService = TestBed.inject(SidebarService) as jasmine.SpyObj<SidebarService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    mockSidebarService.getSidebarItems.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should fetch sidebar items on init', () => {
    const mockItems: SidebarItem[] = [{ name: 'Test Item', orden: 1, icon: 'test' }];
    mockSidebarService.getSidebarItems.and.returnValue(of(mockItems));

    component.ngOnInit();

    expect(mockSidebarService.getSidebarItems).toHaveBeenCalled();
    expect(component.sidebarItems).toEqual(mockItems);
  });

  it('should navigate to login on cerrarSession', () => {
    component.cerrarSession();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
