export class Urls {
    private uri = 'rest/v1'; // to be used on server
    //private uri = 'http://localhost:8080/compas/rest/v1'; // to be used for local testing
    // private uri = 'https://6ea6-197-220-114-46.in.ngrok.io/compas/rest/v1'



    //private uri = 'rest/v1';


    get url(): string {
        return this.uri;
    }

    // set url(uri: string) {
    //     this.uri = 'rest/v1';
    // }
}
