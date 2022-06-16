export class Urls {
    // private uri = 'rest/v1'; // to be used on server
    //  private uri = 'http://localhost:9000/compas/rest/v1'; // to be used for local testing
    private uri = 'https://faf7-197-220-114-46.eu.ngrok.io/compas/rest/v1'



    //private uri = 'rest/v1';


    get url(): string {
        return this.uri;
    }

    // set url(uri: string) {
    //     this.uri = 'rest/v1';
    // }
}
