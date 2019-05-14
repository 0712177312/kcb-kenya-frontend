export class Urls {
    //private uri = 'rest/v1';
    //private uri = 'http://localhost:8090/compas/rest/v1';
    private uri = 'http://172.16.21.72:8090/compas/rest/v1'

    get url(): string {
        return this.uri; // = 'rest/v1' ;
    }

    // set url(uri: string) {
    //     this.uri = 'rest/v1';
    // }
}
