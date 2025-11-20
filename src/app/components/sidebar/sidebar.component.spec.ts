import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { SidebarComponent } from './sidebar.component';
import { SidebarService } from '../../service/sidebar.service';
import { SidebarItem } from '../../models/sidebar-item.model';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let mockSidebarService: jasmine.SpyObj<SidebarService>;

  beforeEach(async () => {
    const sidebarServiceSpy = jasmine.createSpyObj('SidebarService', ['getSidebarItems']);

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        { provide: SidebarService, useValue: sidebarServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    mockSidebarService = TestBed.inject(SidebarService) as jasmine.SpyObj<SidebarService>;
  });

  it('should create', () => {
    mockSidebarService.getSidebarItems.and.returnValue(of([]));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should fetch sidebar items on init', () => {
    const mockItems: SidebarItem[] = [{ name: 'Test', orden: 1, icon: 'test' }];
    mockSidebarService.getSidebarItems.and.returnValue(of(mockItems));

    component.ngOnInit();

    expect(mockSidebarService.getSidebarItems).toHaveBeenCalled();
    expect(component.sidebarItems).toEqual(mockItems);
  });
});
