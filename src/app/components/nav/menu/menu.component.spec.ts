import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MenuComponent } from './menu.component';
import { SidebarItem } from '../../../models/sidebar-item.model';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set idMenu on init', () => {
    component.indicador = 1;
    component.ngOnInit();
    expect(component.idMenu).toBe('sidebarAccordion1');
  });

  it('should accept dataSlidebar input', () => {
    const mockData: SidebarItem[] = [{ name: 'Test', orden: 1, icon: 'test', path: '/test' }];
    fixture.componentRef.setInput('dataSlidebar', mockData);
    fixture.detectChanges();
    expect(component.dataSlidebar).toEqual(mockData);
  });
});
