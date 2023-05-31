import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent implements OnInit {

  listaCursos: string[] = ["C/C++","Java EE","C#","Python","PHP","TypeScript"];

  habilitar: boolean = true;

  constructor() { }

  setHabilitar():void{
    this.habilitar = (this.habilitar==true)?false:true;
  }

  ngOnInit(): void {
    
  }

}
