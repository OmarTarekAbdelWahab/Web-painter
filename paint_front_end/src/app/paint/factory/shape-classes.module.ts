import {NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import Konva from "konva";
import {IRect} from "konva/lib/types";

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})

abstract class CShape{
  //Common attributes
  w =100;
  h =50;
  posx = 400;
  posy = 400;
  scalex = 1;
  scaley = 1;
  rotation = 0;
  colourfill = "";
  colourstroke = "black";
  ID !: number;
  dflag = false;
  abstract koshape : Konva.Shape; //abstract member defined differently in each class
  anchor1!: Konva.Circle;
  anchor2!: Konva.Circle;
  tr !: Konva.Transformer;
  selectionRectangle !: Konva.Rect;
  point : number[]=[];
  constructor(copy?: CShape){ //The constructor has an optional parameter of another shape
    this.posx = 400;
    this.posy = 400;
    this.rotation = copy?.koshape.rotation() ?? 0;
    this.scalex = copy?.koshape.scaleX() ?? 1;
    this.scaley = copy?.koshape.scaleY() ?? 1;
    this.colourfill = copy?.colourfill ?? "";
    this.colourstroke = copy?.colourstroke ?? "black";
    this.tr = copy?.tr ?? this.tr;
    this.selectionRectangle = copy?.selectionRectangle ?? this.selectionRectangle;
    this.dflag = false;
  }
  initalise (posx:number, posy: number, sX: number, sY: number, colourfill: string, rotation: number){
    this.posx = posx;
    this.posy = posy;
    this.koshape.x(posx);
    this.koshape.y(posy);
    this.koshape.scaleX(sX);
    this.koshape.scaleY(sY);
    this.colourfill = colourfill;
    this.koshape.fill(colourfill);
    this.rotation = rotation;
    this.koshape.rotation(rotation);
    this.dflag = false;
  }
  SetColFill(){
    this.colourfill =(<HTMLInputElement>document.getElementById("colorChoice")).value ;
    this.koshape.fill((<HTMLInputElement>document.getElementById("colorChoice")).value);
  }
  destroyshape(l:Konva.Layer){
    if(!this.dflag) {
      this.tr.remove();
      this.koshape.remove();
      this.dflag=true;
    }
  }
  GetLayer(l:Konva.Layer){

  }
  abstract clone() : any;
  check(){
    if(+JSON.stringify(localStorage.getItem('SID')).toString().replace(/\D/g, '')!==this.ID) {
      this.tr.hide();
    }
  }

  settransform(stage:Konva.Stage,layer:Konva.Layer){
    this.tr = new Konva.Transformer();
    layer.add(this.tr);
    stage.on('mouseover', e=> {
      this.check();
      if(+JSON.stringify(localStorage.getItem('SID')).toString().replace(/\D/g, '')===this.ID) {
        this.tr.show();
      }
    });
    this.koshape.on('dragstart', function () {
      this.moveToTop();
    });

    this.koshape.on('dragmove', function () {
      document.body.style.cursor = 'pointer';
    });

    this.koshape.on('mouseover', function () {
      document.body.style.cursor = 'pointer';
    });

    this.koshape.on('mouseleave', e=> {
      document.body.style.cursor = 'default';
    });

    this.koshape.on('click', (e) => {
      this.check();
      this.tr.show();
      console.log(this.ID);
      localStorage.setItem("SID",this.ID.toString());
        this.tr.nodes([this.koshape]);

        this.selectionRectangle = new Konva.Rect({
          fill: 'rgba(0,0,255,0.5)',
          visible: false,
        });
        var x1: number, y1: number, x2, y2;
        stage.on('mousedown touchstart', (e: { target: any; evt: { preventDefault: () => void; }; }) => {
          // do nothing if we mousedown on any shape
          layer.add(this.selectionRectangle);


          if (e.target !== stage) {
            return;
          }
          e.evt.preventDefault();
          x1 = stage.getPointerPosition()!.x;
          y1 = stage.getPointerPosition()!.y;
          x2 = stage.getPointerPosition()!.x;
          y2 = stage.getPointerPosition()!.y;

          this.selectionRectangle.visible(true);
          this.selectionRectangle.width(0);
          this.selectionRectangle.height(0);

        });

        stage.on('mousemove touchmove', (e) => {
          // do nothing if we didn't start selection
          if (!this.selectionRectangle.visible()) {
            return;
          }
          e.evt.preventDefault();
          x2 = stage.getPointerPosition()!.x;
          y2 = stage.getPointerPosition()!.y;

          this.selectionRectangle.setAttrs({
            x: Math.min(x1, x2),
            y: Math.min(y1, y2),
            width: Math.abs(x2 - x1),
            height: Math.abs(y2 - y1),
          });
        });

        stage.on('mouseup touchend', (e: { evt: { preventDefault: () => void; }; }) => {
          // do nothing if we didn't start selection
          if (! this.selectionRectangle.visible()) {
            return;
          }
          e.evt.preventDefault();
          // update visibility in timeout, so we can check it in click event
          setTimeout(() => {
            this.selectionRectangle.visible(false);
          });

          var shapes = stage.find('.rect');
          var box =  this.selectionRectangle.getClientRect();
          var selected = shapes.filter((shape: { getClientRect: () => IRect; }) =>
            Konva.Util.haveIntersection(box, shape.getClientRect())
          );
          this.tr.nodes(selected);
        });

    });

  }

  rekonvo(): object {
    this.koshape.id(this.ID.toString());
    return this.koshape;
  }

  SetID(I:number) {
    this.ID = this.ID + I;
    console.log("*ID*",this.ID);
  }

  GetID(): number {return this.ID;}
}

export class CCircle extends CShape{
  r = 50 ;
  koshape = new Konva.Circle({
    rotationDeg: this.rotation,
    scaleX: this.scalex,
    scaleY: this.scaley,
    x: this.posx,
    y: this.posx,
    radius: this.r,
    fill: this.colourfill,
    stroke: this.colourstroke,
    draggable: true
  });

  constructor(copy?: CCircle){
    super(copy);
    this.ID = 1;
    this.r = copy?.r ?? 50;
  }
  override initalise(posx: number, posy: number, sX: number, sY: number, colourfill: string, rotation: number) {
    super.initalise(posx, posy, sX, sY, colourfill, rotation);
    this.scalex = sX;
    this.scaley = sY;
  }

  clone() {return new CCircle(this);}
}

export class CRectangle extends CShape{


  koshape = new Konva.Rect({
    rotation: this.rotation,
    scaleX: this.scalex,
    scaleY: this.scaley,
    x: this.posx,
    y: this.posy,
    width: this.w,
    height: this.h,
    fill: this.colourfill,
    stroke: this.colourstroke,
    draggable: true
  });

  constructor(copy?: CRectangle){
    super(copy);
    this.ID = 2;
    this.w = copy?.w ?? 100;
    this.h = copy?.h ?? 50;
  }
  override initalise(posx: number, posy: number, sX: number, sY: number, colourfill: string, rotation: number) {
    super.initalise(posx, posy, sX, sY, colourfill, rotation);
    this.w = sX;
    this.h = sY;
  }

  clone() {return new CRectangle(this);}
}

export class CEllipse extends CShape{
  radx = 100;
  rady = 50;

  koshape = new Konva.Ellipse({
    rotation: this.rotation,
    scaleX: this.scalex,
    scaleY: this.scaley,
    x: this.posx,
    y: this.posx,
    radiusX: this.radx,
    radiusY: this.rady,
    fill: this.colourfill,
    stroke: this.colourstroke,
    draggable: true
  });

  constructor(copy?: CEllipse){
    super(copy);
    this.ID = 3;
    this.radx = copy?.radx ?? 100;
    this.rady = copy?.rady ?? 50;
  }
  override  initalise(posx: number, posy: number, sX: number, sY: number, colourfill: string, rotation: number) {
    super.initalise(posx, posy, sX, sY, colourfill, rotation);
    this.radx = sX;
    this.rady = sY;
  }

  clone() {return new CEllipse(this);}
}

export class CTriangle extends CShape{
  r = 50 ;

  koshape = new Konva.RegularPolygon({
    rotation: this.rotation,
    scaleX: this.scalex,
    scaleY: this.scaley,
    x: this.posx,
    y: this.posy,
    sides: 3,
    radius: this.r,
    fill: this.colourfill,
    stroke: this.colourstroke,
    strokeWidth: 4,
    draggable: true
  });

  constructor(copy?: CTriangle){
    super(copy);
    this.ID = 4;
    this.r = copy?.r ?? 50;
  }
  override initalise(posx: number, posy: number, sX: number, sY: number, colourfill: string, rotation: number) {
    super.initalise(posx, posy, sX, sY, colourfill, rotation);
    this.w = sX;
    this.h = sY;
  }

  clone() {return new CTriangle(this);}
}

export class CPentagon extends CShape{
  r = 50 ;

  koshape = new Konva.RegularPolygon({
    rotation: this.rotation,
    scaleX: this.scalex,
    scaleY: this.scaley,
    x: this.posx,
    y: this.posy,
    sides: 5,
    radius: this.r,
    fill: this.colourfill,
    stroke: this.colourstroke,
    strokeWidth: 4,
    draggable: true
  });

  constructor(copy?: CPentagon){
    super(copy);
    this.ID = 5;
    this.r = copy?.r ?? 50;
  }
  override initalise(posx: number, posy: number, sX: number, sY: number, colourfill: string, rotation: number) {
    super.initalise(posx, posy, sX, sY, colourfill, rotation);
    this.w = sX;
    this.h = sY;
  }

  clone() {return new CPentagon(this);}
}

export class CHexagon extends CShape{
  r = 50 ;

  koshape = new Konva.RegularPolygon({
    rotation: this.rotation,
    scaleX: this.scalex,
    scaleY: this.scaley,
    x: this.posx,
    y: this.posy,
    sides: 6,
    radius: this.r,
    fill: this.colourfill,
    stroke: this.colourstroke,
    strokeWidth: 4,
    draggable: true
  });

  constructor(copy?: CHexagon){
    super(copy);
    this.ID = 6;
    this.r = copy?.r ?? 50;
  }
  override initalise(posx: number, posy: number, sX: number, sY: number, colourfill: string, rotation: number) {
    super.initalise(posx, posy, sX, sY, colourfill, rotation);
    this.w = sX;
    this.h = sY;
  }

  clone() {return new CHexagon(this);}
}
export class CSquare extends CShape{


  koshape = new Konva.Rect({
    rotation: this.rotation,
    scaleX: this.scalex,
    scaleY: this.scaley,
    x: this.posx,
    y: this.posx,
    width: this.w,
    height: this.w,
    fill: this.colourfill,
    stroke: this.colourstroke,
    draggable: true
  });

  constructor(copy?: CSquare){
    super(copy);
    this.ID = 7;
    this.w = copy?.w ?? 100;
    this.h = copy?.h ?? 100;
  }
  override initalise(posx: number, posy: number, sX: number, sY: number, colourfill: string, rotation: number) {
    super.initalise(posx, posy, sX, sY, colourfill, rotation);
    this.w = sX;
    this.h = sY;
  }

  clone() {return new CSquare(this);}
}
export class CLine extends CShape{
  koshape = new Konva.Line({
    
    points: this.point,
    x:this.point[0],
    y:this.point[1],
    scaleX:this.point[2],
    scaleY:this.point[3],
    stroke: this.colourfill,
    strokeWidth: 5,
    fill:this.colourstroke,
    lineCap: 'round',
    lineJoin: 'round',
    draggable:true
  });
  line = new Konva.Line({
    points: this.point,
    stroke: this.colourstroke,
    strokeWidth: 5,
    lineCap: 'round',
    lineJoin: 'round',
    draggable:true
  });
  override initalise(posx: number, posy: number, sX: number, sY: number, colourfill: string, rotation: number) {
    this.dflag = false;
    this.point[0] = posx;console.log("x",posx);
    this.point[1] = posy;
    this.point[2] = sX;
    this.point[3] = sY;
    this.colourstroke = colourfill;
  }


  override settransform(stage: Konva.Stage, layer: Konva.Layer) {
    this.koshape.x(this.point[0]);
    this.koshape.y(this.point[1]);
    this.koshape.scaleX(this.point[2]);
    this.koshape.scaleY(this.point[3]);
    this.anchor1 = new Konva.Circle({
      x: this.point[0],
      y: this.point[1],
      radius: 10,
      fill: '',
      draggable: true
    });
    this.anchor2 = new Konva.Circle({
      x: this.point[2],
      y: this.point[3],
      radius: 10,
      fill: '',
      draggable: true
    });
    layer.add(this.anchor1);
    layer.add(this.anchor2);
    this.line.on('dragmove',ev =>{
      this.anchor1.x(  +this.line.getAbsoluteTransform().point({ x: this.point[0], y: this.point[1]}).x);
      this.anchor1.y(  +this.line.getAbsoluteTransform().point({ x: this.point[0], y: this.point[1]}).y);
      this.anchor2.x(  +this.line.getAbsoluteTransform().point({ x: this.point[2], y: this.point[3]}).x);
      this.anchor2.y(  +this.line.getAbsoluteTransform().point({ x: this.point[2], y: this.point[3]}).y);
      this.koshape.x(this.anchor1.x());
      this.koshape.y(this.anchor1.y());
      this.koshape.scaleX(this.anchor2.x());
      this.koshape.scaleY(this.anchor2.y());

    });
    this.line.on('dragend',ev =>{
      this.point[0] =  this.anchor1.absolutePosition().x;
      this.point[1] =  this.anchor1.absolutePosition().y;
      this.point[2] =  this.anchor2.absolutePosition().x;
      this.point[3] =  this.anchor2.absolutePosition().y;
      this.line.setAbsolutePosition({ x:0, y: 0});
      /*this.koshape.x(this.line.points()[0]);
      this.koshape.y(this.line.points()[1]);
      this.koshape.scaleX(this.line.points()[2]);
      this.koshape.scaleY(this.line.points()[3]);*/
    });
    this.anchor1.on('mouseover', function () {
      document.body.style.cursor = 'pointer';
    });
    this.anchor2.on('mouseover', function () {
      document.body.style.cursor = 'pointer';
    });
    this.anchor1.on('mouseout', function () {
      document.body.style.cursor = 'default';
    });
    this.anchor2.on('mouseout', function () {
      document.body.style.cursor = 'default';
    });
    this.anchor1.on('dragmove', ev =>{
      //console.log(this.koshape.getAbsoluteTransform().point({x:this.points[0],y:this.points[1]}))
      this.point[0] = this.anchor1.x();
      this.point[1] =  this.anchor1.y();
      this.point[2] =  this.anchor2.x();
      this.point[3] =  this.anchor2.y();
      this.line.points(this.point);
      this.koshape.x(this.point[0]);
      this.koshape.y(this.point[1]);
      this.koshape.scaleX(this.point[2]);
      this.koshape.scaleY(this.point[3]);
      console.log("update",this.line.fill());

    });
    this.anchor2.on('dragmove', ev => {
      //console.log(this.koshape.getAbsoluteTransform().point({x:this.points[0],y:this.points[1]}))
      this.point[0] = this.anchor1.x();
      this.point[1] =  this.anchor1.y();
      this.point[2] =  this.anchor2.x();
      this.point[3] =  this.anchor2.y();
      this.line.points(this.point);
      this.koshape.x(this.point[0]);
      this.koshape.y(this.point[1]);
      this.koshape.scaleX(this.point[2]);
      this.koshape.scaleY(this.point[3]);
      console.log("update",this.line.fill());
    });
    this.line.on('dragstart', function () {
      this.moveToTop();
    });

    this.line.on('dragmove', function () {
      document.body.style.cursor = 'pointer';
    });

    this.line.on('mouseover', function () {
      document.body.style.cursor = 'pointer';
    });

    this.line.on('mouseleave', e=> {
      document.body.style.cursor = 'default';
    });
    this.line.on('click', e=> {
      console.log(this.ID);
      localStorage.setItem("SID",this.ID.toString());
      document.body.style.cursor = 'default';
    });
  }
  override rekonvo(): object {
    return this.line;
  }

  override destroyshape() {
    if(!this.dflag) {
      this.line.remove();
      this.anchor1.remove();
      this.anchor2.remove();
    }
  }

  constructor(copy?: CLine){
    super(copy);
    this.ID = 8;
    this.point[0] = copy?.point[0] ??5;
    this.point[1] = copy?.point[1] ??70;
    this.point[2] = copy?.point[2] ??140;
    this.point[3] = copy?.point[3] ??23;
    this.posx = copy?.point[0] ??5;
    this.posy = copy?.point[1] ??70;
    this.scalex = copy?.point[2] ??140;
    this.scaley = copy?.point[3] ??23;

  }


  override SetColFill() {
    super.SetColFill();
    this.colourstroke =(<HTMLInputElement>document.getElementById("colorChoice")).value ;
    this.koshape.fill((<HTMLInputElement>document.getElementById("colorChoice")).value)
    this.line.stroke((<HTMLInputElement>document.getElementById("colorChoice")).value);
  }

  clone() {return new CLine(this);}
}
