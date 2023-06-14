import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MySharedService } from '../services/sharedService';
import { Urls } from '../services/url';
import { UrlTree, DefaultUrlSerializer, Router } from '@angular/router';

@Injectable()
export class EncryptionInterceptor implements HttpInterceptor {
    private encryptURLList: string[];
    private ignoreEncrypURLList: string[];
    private abisEncryptUrls = [
        "/Enroll",
        "/verifyMultiple",
        "/verify",
        // "/identify",
        "/delete",
        "/login",
    ]

    private abisIgnoreURLList = [
        "/identify"
    ]

    private compassEncryptUrls = [
        "/tellers/staff_inquiry",
        "/tellers/gtTellers",
        "/tellers/gtBranchTellers",
        "/tellers/gtTeller",
        "/tellers/checkStaffApproved",
        "/tellers/tellersToApprove",
        "/tellers/tellersToApproveDetach",
        "/tellers/approveTeller",
        "/tellers/approveTeller",
        "/tellers/obtainTellerDetails",
        "/tellers/previewStaff",
        "/sysusers/print/auth",
        "/sysusers/auth",
        "/usergroups/usergroup",
        "/usergroups/getUserGroupUsingGroupId",
        "/usergroups/gtUserGroups",
        "/usergroups/gtRights",
        "/usergroups",
        "/getSystemActivity",
        "/gtLogs",
        "/rightsmenulist",
        "/gtBranchesPrev",
        "/gtCountriesToWaive",
        "/gtWaivedCountries",
        "/gtWaivedBranches",
        "/getBranchesToWaive",
        "/gtActiveBranches",
        "/gtBranches",
        "/gtActiveCountryBranches",
        "/gtActiveCountries",
        "/gtCountries",
        "/menulist/group",
        "/menulist",
        "/dashboard/cardinfo",
        "/dashboard/topbranches",
        "/dashboard/configs",
        "/rejectRemoveCustomer",
        "/approveRemoveCustomer",
        "/previewCustomers",
        "/gtWaivedCustomers",
        "/gtCustomerToWaive",
        "/customersToApproveDetach",
        "/customersToApprove",
        "/obtainCustomerDetails",
        "/identifyCustomer",
        "/getMatchedCustomers",
        "/gtCustomers",
        "/customer_inquiry",
        "/gtWaivedchannels",
        "/gtChannelstoWaive",
        "/gtchannels",
        "/auth/manual_login",
        "/getLoggedInUserDetails"
    ]


    constructor(private globalService: MySharedService, private router: Router) {
    }

    private buildURLList() {
        const apiUrl = new Urls().url;
        const abisURL = this.globalService.getAbisClient()
        const fullAbisUrls = this.abisEncryptUrls.map(endpoint => abisURL + endpoint);
        const fullCompassUrls = this.compassEncryptUrls.map(endpoint => apiUrl + endpoint);
        this.encryptURLList = [
            ...fullAbisUrls,
            ...fullCompassUrls
        ]
        console.log("EncrypList", this.encryptURLList)
        const fullAbisIgnore = this.abisIgnoreURLList.map(endpoint => abisURL + endpoint);
        this.ignoreEncrypURLList = [
            ...fullAbisIgnore
        ]
        console.log("ignoreEncrypURLList", this.ignoreEncrypURLList)
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.buildURLList();
        const url = req.url
        const shouldEncrypt = this.shouldEncryptURL(url)
        return from(this.encryptRequest(req)).pipe(
            switchMap((encryptedReq: any) => next.handle(encryptedReq)),

            switchMap((event) => {
                if (shouldEncrypt) {
                    console.log("SHOULD DECRYPT:", url)
                    const decryptedData = this.decryptResponse(event as any)
                    return from(decryptedData)
                }
                console.log("SHOULD NOT DECRYPT:", url)
                return of(event)
            })
        );
    }

    private shouldEncryptURL(url: string): boolean {
        if (this.encryptURLList.includes(url)) {
            return true
        }

        if (url.includes('?')) {
            const [baseURL] = url.split('?')
            console.log("BASEURL::", baseURL)

            if (this.encryptURLList.includes(baseURL)) {
                return true
            }
            return false
        }
        return false
    }


    async encryptRequest(req: HttpRequest<any>): Promise<HttpRequest<any>> {
        const url = req.url;
        const encryptionKey = this.globalService.generateRandomEncryptionKey();
        console.log("encryptionKey", encryptionKey)
        const encryptedKey = this.globalService.encryptWithPublicKey(encryptionKey);
        console.log("encryptedKey", encryptedKey)

        if (req.method === 'GET' && url.includes('?')) {
            req = req.clone({ headers: req.headers.set('Enckey', encryptedKey) });

            const [baseURL, queryParams] = req.url.split('?');
            const encryptedParams = queryParams.split('&').map(param => {
                const [key, value] = param.split('=');
                const encryptedParam = this.globalService.encryptDataV2(value, encryptionKey);
                // const encryptedParam = this.globalService.encryptData(value);
                return `${key}=${encodeURIComponent(encryptedParam)}`;
            })
            console.log("encryptedParams", encryptedParams)
            const encryptedUrl = `${baseURL}?${encryptedParams.join('&')}`;
            return req.clone({ url: encryptedUrl });

        } else if (req.method === 'POST' && req.body) {
            req = req.clone({ headers: req.headers.set('key', encryptedKey) });

            if (this.ignoreEncrypURLList.includes(req.url)) {
                console.log("Ignore Encrypt URL:", req.url)
                return req
            }
            const encryptedBody = this.globalService.encryptDataV2(req.body, encryptionKey);
            // const encryptedBody = this.globalService.encryptData(req.body);
            return req.clone({ body: encryptedBody });
        }

        return req;
    }


    private async decryptResponse(res: HttpResponse<any>): Promise<HttpResponse<any>> {


        if (res.body) {
            // extract the key from the response
            const encryptedKey = res.headers.get('Enckey');
            console.log("encryptedKey", encryptedKey)
            const encryptionKey = this.globalService.decryptWithPrivateKey(encryptedKey);
            console.log("encryptionKey", encryptionKey)

            console.log("DecryptingBody", res.url)
            const decryptedBody = this.globalService.decryptDataV2(res.body, encryptionKey);
            // const decryptedBody = this.globalService.decryptData(res.body);
            console.log("decryptedBody", decryptedBody)
            if (this.isJSONString(decryptedBody)) {
                return res.clone({ body: decryptedBody });
            }
            return res.clone({ body: JSON.parse(decryptedBody) });
        }
        console.log("Status", res.status)
        console.log("ResponseBODY", res.body)
        return res;
    }


    private isJSONString(str) {
        try {
            JSON.parse(str)
        } catch (e) {
            return false
        }
        return true
    }
}

