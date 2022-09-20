import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'gui';
  constructor(translate: TranslateService) {
    const locale = translate.getBrowserLang();
    const languagesAvail = translate.getLangs();
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    if (locale && languagesAvail.find((lang) => lang === locale)) {
      translate.use(locale);
    } else {
      const defaultLang = translate.defaultLang;
      // Use default language
      translate.use(defaultLang);
    }
  }
}
