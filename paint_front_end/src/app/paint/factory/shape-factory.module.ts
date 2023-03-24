import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CCircle, CEllipse, CHexagon, CLine, CPentagon, CRectangle, CSquare, CTriangle} from "./shape-classes.module";



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ShapeFactoryModule {
  public getsahape(ty :string):object{
    if(ty ==="circle"){
      return  new CCircle();
    }
    else if(ty ==="rectangle"){
      return new CRectangle();
    }
    else if(ty ==="ellipse"){
      return new CEllipse();
    }
    else if(ty ==="triangle"){
      return new CTriangle();
    }
    else if(ty ==="pentagon"){
      return new CPentagon();
    }
    else if(ty ==="hexagon"){
      return new CHexagon();
    }
    else if(ty ==="square"){
      return new CSquare();
    }
    else if(ty ==="line"){
      return new CLine();
    }
    return new Object;
  }
 }
