import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-shimmer',
  templateUrl: './table-shimmer.component.html',
  styleUrls: ['./table-shimmer.component.scss']
})
export class TableShimmerComponent implements OnInit {

  @Input() rows: number = 5;
  @Input() columns: number = 4;

  rowArray: number[] = [];
  columnArray: number[] = [];

  ngOnChanges(): void {
    this.rowArray = Array.from({ length: this.rows });
    this.columnArray = Array.from({ length: this.columns });
  }

  ngOnInit(): void {
  }

  

}
