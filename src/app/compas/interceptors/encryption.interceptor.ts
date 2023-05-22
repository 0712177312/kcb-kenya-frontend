import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MySharedService } from '../services/sharedService';
import { Urls } from '../services/url';

@Injectable()
export class EncryptionInterceptor implements HttpInterceptor {
    private readonly encryptURLList: string[];

    constructor(private globalService: MySharedService) {
        const apiUrl = new Urls().url;
        this.encryptURLList = [
            "/tellers/staff_inquiry",
            "/tellers/gtTellers",
            "/tellers/gtBranchTellers",
            "/tellers/gtTeller",
            "/tellers/checkStaffApproved",
            "/tellers/tellersToApprove",
            "/tellers/tellersToApproveDetach",
            "/tellers/approveTeller",
            "/tellers/approveTeller",
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
        ].map(endpoint => apiUrl + endpoint);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = req.url
        const shouldEncrypt = this.shouldEncryptURL(url)
        console.log(url + ":::" + shouldEncrypt)
        return from(this.encryptRequest(req)).pipe(
            //TODO: pass encrypted data when posting
            switchMap((encryptedReq: any) => next.handle(req)),

            switchMap((event) => {
                if (this.shouldEncryptURL(url)) {
                    console.log("SHOULD DECRYPT:", url)
                    const decryptedData = this.decryptResponse(event as any)
                    return from(decryptedData)
                }
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

    private async encryptRequest(req: HttpRequest<any>): Promise<HttpRequest<any>> {
        const url = req.url;
        if (this.shouldEncryptURL(url)) {

            if (req.method === 'GET' && url.includes('?')) {
                const [baseURL, queryParams] = req.url.split('?');
                const encryptedParams = this.globalService.encryptData(queryParams);
                return req.clone({ url: `${baseURL}?${encryptedParams}` });
            } else if (req.method === 'POST' && req.body) {
                const encryptedBody = this.globalService.encryptData(req.body);
                return req.clone({ body: encryptedBody });
            }
        }
        return req;
    }

    private async decryptResponse(res: HttpResponse<any>): Promise<HttpResponse<any>> {

        if (res.body) {
            const decryptedBody = this.globalService.decryptData(res.body);
            if (this.isJSONString(decryptedBody)) {
                return res.clone({ body: decryptedBody });
            }
            return res.clone({ body: JSON.parse(decryptedBody) });
        }
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

