import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-wellcome',
  templateUrl: './wellcome.page.html',
  styleUrls: ['./wellcome.page.scss'],
})
export class WellcomePage implements OnInit {
  opts = {
    initialSlide: 0,
    speed: 400,
  };

  constructor(private router: Router) {}

  ngOnInit() {}

  start(): void {
    this.router.navigate(['/wellcome/step1']);
  }
}
