import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CategoriesPage } from './categories.page';
import { AddToCartComponent } from '../add-to-cart/add-to-cart.component';
import { ShowCartComponent } from '../show-cart/show-cart.component';

const routes: Routes = [
  {
    path: '',
    component: CategoriesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    CategoriesPage,
    AddToCartComponent,
    ShowCartComponent
  ],
  entryComponents: [
    AddToCartComponent,
    ShowCartComponent
  ]
})
export class CategoriesPageModule {}
