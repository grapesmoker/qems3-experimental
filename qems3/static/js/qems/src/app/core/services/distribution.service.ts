import { Injectable } from '@angular/core';
import { GenericRestClientService } from './generic-rest-client.service'
import { Distribution } from 'src/app/types';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DistributionService extends GenericRestClientService<Distribution> {

  constructor(httpClient: HttpClient) { 
    super(httpClient, '/qsub/api/distributions/:id')
  }

}
