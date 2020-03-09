import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  // API_URL = 'http://localhost:3000/api/v1/';
  // API_URL = 'https://b2b2c.herokuapp.com/api/v1/';
   API_URL = 'https://csme.herokuapp.com/api/v1/';
  constructor() { }
}
