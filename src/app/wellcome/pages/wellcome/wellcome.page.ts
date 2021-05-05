import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    this.router.navigate(['/password-creation']);
  }
}
