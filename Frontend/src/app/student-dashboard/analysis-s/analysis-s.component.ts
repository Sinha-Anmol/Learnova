import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-analysis-s',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './analysis-s.component.html',
  styleUrls: ['./analysis-s.component.scss']
})
export class AnalysisSComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

} 