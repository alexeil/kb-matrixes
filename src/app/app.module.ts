import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TeamInputComponent } from './components/team-input/team-input.component';
import { MatrixComponent } from './components/matrix/matrix.component';

@NgModule({
  declarations: [
    AppComponent,
    TeamInputComponent,
    MatrixComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }