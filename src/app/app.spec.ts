import { TestBed } from '@angular/core/testing';
import { App } from './app';
import {provideRouter, withComponentInputBinding} from '@angular/router';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        withComponentInputBinding()
      ],
    }).compileComponents();
  });

  it('should be created', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

});
