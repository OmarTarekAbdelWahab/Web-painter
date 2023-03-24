

export interface IShape {
  ID : number;
  posx: number;
  posy: number;
  colourfill: string;
  colourstroke: string;
  koshape : object;
  rekonvo():object;
  SetID(I:number):void
  GetID():number;
}

