import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PrevioComponent} from './previo/previo.component';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'previo', component: PrevioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
