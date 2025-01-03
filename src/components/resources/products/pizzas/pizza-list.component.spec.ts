import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PizzaListComponent} from './pizza-list.component';

describe('ProductListComponent', () => {
  let component: PizzaListComponent;
  let fixture: ComponentFixture<PizzaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PizzaListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PizzaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
