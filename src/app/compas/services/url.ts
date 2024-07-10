export class Urls {
    //private uri = 'rest/v1'; // to be used on servers
    // private uri = 'https://735a-197-220-114-46.in.ngrok.io/compas/rest/v1'


   // private uri = 'http://localhost:8090/compas/rest/v1' // localhost 
    private uri = 'http://10.216.1.74:8090/compas/rest/v1' // UAT ENV

   // DR servers==START
    //private uri = 'http://172.17.74.250:8090/compas/rest/v1'
   // private uri = 'http://172.17.74.32:8090/compas/rest/v1'
   //END HERE
   //PROD servers==START
    //private uri = 'http://172.16.18.143:8090/compas/rest/v1'
    // private uri = 'http://172.16.18.144:8090/compas/rest/v1'
     //END HERE

   
   // private outUri = "http://localhost:8090/compas" //localhost
    private outUri = "http://10.216.1.74:8090/compas" //UAT ENV

    // DR servers==START
    // private outUri = 'http://172.17.74.250:8090/compas'
    //private outUri = 'http://172.17.74.32:8090/compas'
    //END HERE
    //PROD servers==START
    // private outUri = 'http://172.16.18.143:8090/compas'
    //private outUri = 'http://172.16.18.144:8090/compas'
    //END HERE
   
    // private outUri = ""



    //private uri = 'rest/v1';


    get url(): string {
        return this.uri;
    }

    get outUrl(): string {
        return this.outUri;
    }

    // set url(uri: string) {
    //     this.uri = 'rest/v1';
    // }
}
