import { Injectable } from '@angular/core';
import { GenericRestClientService } from './generic-rest-client.service'
import { Category } from 'src/app/core/types/models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends GenericRestClientService<Category> {

  constructor(httpClient: HttpClient) { 
    super(httpClient, '/qsub/api/categories/:id/')
  }

}
