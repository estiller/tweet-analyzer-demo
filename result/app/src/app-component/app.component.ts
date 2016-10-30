export class AppComponent {
    public title:string; 
    public hostName:string;

    constructor(private $http:ng.IHttpService){
        this.title = "Tweeter Analyzer";
        $http.get('/hostName').then(
            (resolve) => {
                this.hostName = <string>resolve.data;
            },
            (Error) => {
                this.hostName = 'undefined';
            }
        )
    }
};
