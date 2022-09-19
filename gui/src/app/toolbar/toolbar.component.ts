import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  locale = 'en';

  constructor(public translate: TranslateService) {}

  ngOnInit(): void {
    this.locale = window.navigator.language;
  }
}
