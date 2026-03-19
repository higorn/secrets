import { Component, OnInit } from '@angular/core';
import { TranslatorService } from 'src/app/shared/translator.service';

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

  constructor(private translate: TranslatorService) {}

  ngOnInit() {}
}
