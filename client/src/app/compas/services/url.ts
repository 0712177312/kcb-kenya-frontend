export class Urls {
    private uri = 'rest/v1';

    get url(): string {
        return this.uri; // = 'rest/v1' ;
    }

    // set url(uri: string) {
    //     this.uri = 'rest/v1';
    // }
}
