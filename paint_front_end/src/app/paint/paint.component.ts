import { Component, OnInit } from '@angular/core';
import { ShapeFactoryModule } from './factory/shape-factory.module';
import Konva from "konva";
import { SaveClass } from './save-class.module';
import { stringToArray } from 'konva/lib/shapes/Text';
import { PaintService } from '../paint.service';
import { delay } from 'rxjs';


@Component({
  selector: 'app-paint',
  templateUrl: './paint.component.html',
  styleUrls: ['./paint.component.css']
})

export class PaintComponent implements OnInit {
  mode!: string;

  constructor(private paintService: PaintService) { }
  isStart= true;
  op = "co";
  isUndo = false;
  isRedo = false;
  unCount = 0;
  reCount = 0;
  ngOnInit(): void {
    this.clear();
    this.stage = new Konva.Stage({
      container: 'container',
      width: 1500,
      height: 1000
    });
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    //new
    this.stage.on('mouseup touchend',  (e: { target: any; })=> {
      // e.target is a clicked Konva.Shape or current stage if you clicked on empty space
      this.sendRequest();
    });

  }

  clear(){
    this.paintService.clear().subscribe(
      (response: any) => {
        //new
        this.sendRequest();
      }
    );
  }
  Los: any[]=[];
  Ids: String[] = [];
  str : string = "";
  i :number =0;
  stage !: Konva.Stage;
  layer !:Konva.Layer;
  shape2 !:Konva.Shape;
  shape !:string;
  object :any;
  col !: HTMLElement;
  select :boolean=false;
  factory = new ShapeFactoryModule();
  tr !:Konva.Transformer;
  selectionRectangle !: Konva.Rect;
  counter = 0;
  saved: any[] = [];
  saveArray: SaveClass[] = [];
  saveArrayprev: SaveClass[] = [];
  flag = false;
  saveflag = false;
  sa: any[] = [];
  canvas = document.createElement('canvas');
   context = this.canvas.getContext('2d');
  //new
  public chaeckEqual(){
    if(!this.isStart){
      for (var i = 0; i < this.saveArray.length; ++i) {
        if (JSON.stringify(this.saveArray[i]) !== JSON.stringify(this.saveArrayprev[i])){
          this.saveArrayprev=this.saveArray;
          return false;}
      }
      return true;
    }
    return false;
  }
  public sendRequest(){
    if(!this.isStart){
      this.unCount++;
      this.isUndo = true;
      this.isRedo = false;
      this.reCount = 0;}//new
    this.saveData(0);
    if(this.chaeckEqual())console.log("equal");
    else{ console.log("not equal");


      this.paintService.addSave(this.saveArray).subscribe(
        (response: any) =>{

        }
      );
      console.log("Sent successfully");
      this.isStart = false}
  }
  public async redo(){
    this.reCount--;
    this.unCount++;
    this.isUndo = true;
    if(this.reCount == 0)
      this.isRedo = false;
    this.paintService.redo().subscribe(
      (response: SaveClass[]) => {
        this.saveArray = response;
        this.showLoad(this.saveArray);

      }
    );
    console.log("delaying");
    await this.Wait(150);

  }
  public async undo(){
    this.isRedo = true;
    this.isRedo = true;
    this.unCount--;
    this.reCount++;
    if(this.unCount == 0)
      this.isUndo = false;
    this.paintService.undo().subscribe(
      (response: SaveClass[]) => {
        this.saveArray = response;
        console.log("id",this.saveArray);
        this.showLoad(this.saveArray);
      }
    );
    console.log("delaying");
    await this.Wait(150);
  }
  public async loadData(){
    this.paintService.load().subscribe(
      (response: SaveClass[]) => {
        this.saveArray = response;
        this.showLoad(this.saveArray);
        this.sendRequest();//new
      }
    );
    console.log("delaying");
    await this.Wait(150);
    console.log("loaded")
    console.log(this.saveArray);


  }
  public save(){
    this.saveArray = [];

    for(let i = 0; i<this.Ids.length;i++){
      let n: any = +this.Ids[i];
      let st = this.Ids[i];
      if(this.sa[i]){
        const save: SaveClass = new SaveClass;
        save.ID =this.Ids[i];
        
        save.colourfill = this.sa[i].koshape.fill();
        //console.log("color",save.colourfill);
        save.posx = this.sa.at(i).koshape.x();console.log("kox",this.sa.at(i).koshape.x())
        save.posy = this.sa.at(i).koshape.y();
        console.log("save")
        console.log("rot:",this.sa.at(i).koshape.rotation());
        save.rotation = this.sa.at(i).koshape.rotation();
        save.w = this.sa.at(i).koshape.scaleX();
        save.h = this.sa.at(i).koshape.scaleY();
        save.shapeType = this.getType(st)
        this.saveArray.push(save);}
    }
    console.log(this.saveArray);
  }
  getType(id:String){
    let n: any = +id;
    n = n % 10;
    //console.log(r)
    switch(n){
      case 1:
        return 'circle';
      case 2:
        return 'rectangle';
      case 3:
        return 'ellipse';
      case 4:
        return 'triangle';
      case 5:
        return 'pentagon';
      case 6:
        return 'hexagon';
      case 7:
        return 'square';
      case 8:
        return 'line';
      default:
        return '';
    }
  }
  public saveData(op: number){
    this.save();
    let data = this.saveArray;
    localStorage.setItem('shapes' , JSON.stringify(data));
  }
  public showLoad(saved: any[]){
    for(let i = 0; i<this.Ids.length;i++){
      let st = this.Ids[i];
      let s = String(st);
      s = '#' + s;
      this.i = +String(st);
      this.i = (this.i-(this.i%10))/10;
      this.object = (this.Los).at(this.i);
      this.object.destroyshape(this.layer)
      
    }
    this.Ids = []
    this.sa = [];
    //console.log("Cleared");
    this.flag = true;
    for(let i = 0; i <saved.length; i++){
      
      this.show(saved[i].shapeType, saved[i]);
    }
  }
  public show(sh :string, obj :any){
    this.object = this.factory.getsahape(sh);
    if(this.flag){
      console.log(this.object);
      this.object.initalise(obj.posx, obj.posy, obj.w, obj.h, obj.colourfill,obj.rotation);
      console.log("object",this.object);
      
     

    }
    this.object.SetID(this.counter);
    this.object.settransform(this.stage,this.layer);
    this.shape2= this.object.rekonvo();
    if(sh=="line"&&obj){
      this.shape2.stroke(obj.colourfill);
    }
    this.counter += 10;
    //console.log(typeof (this.shape2));
    this.Los.push(this.object);
     console.log("id***",this.shape2.id);
    this.layer.add(this.shape2);
    this.Ids.push(this.object.ID);
   
    this.sa.push(this.object);

  }

  public Shape(ty: string) {
    this.shape = ty;
    this.flag=false;
    if (this.shape==="rectangle"){
      this.show("rectangle",null);
    }
    else if (this.shape==="circle"){
      this.show("circle",null);
    }
    else if (this.shape==="triangle"){
      this.show("triangle",null);
    }
    else if (this.shape==="pentagon"){
      this.show("pentagon",null);
    }
    else if (this.shape==="hexagon"){
      this.show("hexagon",null);
    }
    else if (this.shape==="ellipse"){
      this.show("ellipse",null);
    }
    else if(this.shape==="square"){
      this.show("square",null);
    }
    else if(this.shape==="line"){
      this.show("line",null);
    }
    this.sendRequest();
  }
  option(s :string) {
    this.op = s;
    console.log(this.op);
  }
  getShapeObject(){
    this.str = JSON.stringify(localStorage.getItem('SID')).toString();
    this.str = this.str.replace(/\D/g, '');
    this.i = +this.str;
    this.str = "#"+this.str;
    //console.log(typeof (sh));
    this.i = (this.i-(this.i%10))/10;
    this.object = (this.Los).at(this.i);
  }
  recolour() {
    this.getShapeObject();
    //console.log(typeof (sh));
    this.object.SetColFill();
    this.sendRequest();
  }

  Delete() {
    this.str = JSON.stringify(localStorage.getItem('SID')).toString();
    this.str = this.str.replace(/\D/g, '');
    for (let i=0;i<this.sa.length;i++){
      if(this.sa[i].ID==this.str){
        console.log(this.sa[i].ID);
        this.sa.splice(i, 1);
        this.Ids.splice(i, 1);
        break;
      }
    }
    this.getShapeObject();
    this.object.destroyshape();
    this.isStart = true;
    this.sendRequest();

  }
 Copy() {
   this.getShapeObject();
   console.log(typeof (this.object.clone()))
   this.object = this.object.clone();
   this.object.SetID(this.counter);
   this.object.settransform(this.stage,this.layer);
   this.shape2= this.object.rekonvo();
   this.counter += 10;
   this.Los.push(this.object);
   this.layer.add(this.shape2);
   this.Ids.push(this.object.ID);
   console.log(this.Ids);
   this.sa.push(this.object);
   this.flag=true;
   this.sendRequest();
  }
  clearScreen(){
    this.stage.destroyChildren();
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
   this.sa = []
    this.saveArray = [];
    this.isStart=true;//new
    this.sendRequest();//new
    this.unCount++;//new
    
  }
  Wait(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  saveToBack(){
    this.paintService.save().subscribe(
      (response: any) =>{
        this.sendRequest();
      }
    );
    //console.log("save successfully");

  }
  freehand(){
    
    this.canvas.width = this.stage.width();
    this.canvas.height = this.stage.height();
    var sizebrush =5;

    // created canvas we can add to layer as "Konva.Image" element
    var image = new Konva.Image({
      image: this.canvas,
      x: 0,
      y: 0,
    });
    this.layer.add(image);

    // Good. Now we need to get access to context element
    
    this.context!.strokeStyle = (<HTMLInputElement>document.getElementById("colorChoice")).value;
    this.context!.lineJoin = 'round';
    this.context!.lineWidth = sizebrush;


    var isPaint = false;
    var lastPointerPosition:any;
     this.mode = 'brush';

    // now we need to bind some events
    // we need to start drawing on mousedown
    // and stop drawing on mouseup
    image.on('mousedown touchstart', e=> {

      isPaint = true;
      lastPointerPosition = this.stage.getPointerPosition();

      console.log("start");
    });

    // will it be better to listen move/end events on the window?

    this.stage.on('mouseup touchend', e=> {
      
      isPaint = false;
    });

    // and core function - drawing
    this.stage.on('mousemove touchmove', e=>{
      if (!isPaint) {
        return;
      }

      if (this.mode === 'brush') {
        this.context!.globalCompositeOperation = 'source-over';
      }
      if (this.mode === 'eraser') {
        this.context!.globalCompositeOperation = 'destination-out';
      }
      this.context!.beginPath();

      var localPos = {
        x: lastPointerPosition.x - image.x(),
        y: lastPointerPosition.y - image.y(),
      };
      this.context!.moveTo(localPos.x, localPos.y);
      var pos =this.stage.getPointerPosition();
      localPos = {
        x: pos!.x - image.x(),
        y: pos!.y - image.y(),
      };
      this.context!.lineTo(localPos.x, localPos.y);
      this.context!.closePath();
      this.context!.stroke();

      lastPointerPosition = pos;
      // redraw manually
      this.layer.batchDraw();
    });

    var select = document.getElementById('tool');
    select!.addEventListener('change', e=> {
      this.mode = (<HTMLInputElement>document.getElementById('tool')).value;
    });

    
  }
  }
