export class Urls {
    // private uri = 'rest/v1'; // to be used on server
    //private uri = 'http://localhost:8080/compas/rest/v1'; // to be used for local testing
    // private uri = 'https://735a-197-220-114-46.in.ngrok.io/compas/rest/v1'

    private uri = 'http://10.216.1.74:8090/compas/rest/v1' // UAT ENV



    //private uri = 'rest/v1';


    get url(): string {
        return this.uri;
    }

    // set url(uri: string) {
    //     this.uri = 'rest/v1';
    // }
}
