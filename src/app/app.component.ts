import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'comite-clasificacion-joffroy';
  constructor(private router: Router) {}
  openNewPrevio() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
    KTDrawer.createInstances();
    const drawerElement = document.querySelector('#nuevo_previo_drawer');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
    const drawer = KTDrawer.getInstance(drawerElement);
    drawer.show();
  }

  ngOnInit(): void {

  }
}
