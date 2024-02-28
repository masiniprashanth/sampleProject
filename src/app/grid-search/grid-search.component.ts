import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { userDetails } from '../models/datamodels';
import { Init } from 'v8';
import { CommonServiceService } from '../services/common-service.service';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-grid-search',
  templateUrl: './grid-search.component.html',
  styleUrl: './grid-search.component.scss'
})
export class GridSearchComponent implements OnInit, OnDestroy {

  public userDetails: userDetails[] = [];
  public displayedColumns: string[] = ['No', 'login', 'id', 'avatar_url', 'url', 'type', 'site_admin', 'score'];
  searchControl = new FormControl('');
  public destroy$: Subject<void> = new Subject<void>();

  constructor(private commonService: CommonServiceService) {
    
  }

  ngOnInit(): void {
    this.getUserDetails();
    this.setupSearchInputSubscription();
  }

  getUserDetails(searchValue = 'Q') {
    this.commonService.getUserDetails(searchValue == "" ? "Q" : searchValue).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: any) => {
        this.userDetails = data.items.slice(0, 50);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  private setupSearchInputSubscription(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((newValue: any) => {
      if (!(newValue.trim() === '')) {
        this.loadUsers(newValue);
      }

    });
  }

  private loadUsers(newValue: any): void {
    this.getUserDetails(newValue);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
