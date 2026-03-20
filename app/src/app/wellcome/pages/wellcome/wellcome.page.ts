import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-wellcome',
  templateUrl: './wellcome.page.html',
  styleUrls: ['./wellcome.page.scss'],
})
export class WellcomePage {
  slideIndex = 0;
  readonly lastSlideIndex = 5;

  next(): void {
    if (this.slideIndex < this.lastSlideIndex) {
      this.slideIndex++;
    }
  }
}
