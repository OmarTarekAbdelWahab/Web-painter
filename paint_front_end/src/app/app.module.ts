import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { PaintComponent } from './paint/paint.component';



@NgModule({
  declarations: [
    AppComponent,
    PaintComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    
   
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {
  
}
