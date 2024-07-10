import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private http: HttpClient) { }

   getUrl() {
    let resp: any;
     this.http.get('./assets/configurations/configurations.json').toPromise().then((res: any) => {
        resp = res;
    });

    return resp;
}

}
