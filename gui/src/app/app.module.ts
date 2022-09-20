import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ViewEmployeesDashboardComponent } from './view-employees-dashboard/view-employees-dashboard.component';
import { ViewEmployeeDetailDialogComponent } from './view-employee-detail-dialog/view-employee-detail-dialog.component';
import { UpdateEmployeeDetailDialogComponent } from './update-employee-detail-dialog/update-employee-detail-dialog.component';
import { DeleteEmployeeDetailDialogComponent } from './delete-employee-detail-dialog/delete-employee-detail-dialog.component';
import { CreateEmployeeDetailDialogComponent } from './create-employee-detail-dialog/create-employee-detail-dialog.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    FileUploadComponent,
    ToolbarComponent,
    ViewEmployeesDashboardComponent,
    ViewEmployeeDetailDialogComponent,
    UpdateEmployeeDetailDialogComponent,
    DeleteEmployeeDetailDialogComponent,
    CreateEmployeeDetailDialogComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
