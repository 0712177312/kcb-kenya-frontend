package com.compulynx.compas.controllers;

import java.util.Date;
import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.compulynx.compas.customs.Api;
import com.compulynx.compas.customs.responses.GlobalResponse;
import com.compulynx.compas.models.SysLogs;
import com.compulynx.compas.models.reports.RptSysLogs;
import com.compulynx.compas.services.SysLogService;

@RestController
@RequestMapping(value = Api.REST)
public class SysLogsController {
    @Autowired
    private SysLogService sysLogService;

    @PostMapping(value = "/sysLog")
    public ResponseEntity<?> approveCustomerWaive(@RequestBody SysLogs log) {
        try {
            int logs = sysLogService.log(log.getUserId(), log.getActivity());
            if (logs > 0) {
                return new ResponseEntity<>(new GlobalResponse(
                        "000", "logged", true, GlobalResponse.APIV), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "201",
                        false, "failed to log"), HttpStatus.OK);
            }
        } catch (Exception e) {
            GlobalResponse resp = new GlobalResponse("404", "error processing logs request", false, GlobalResponse.APIV);
            e.printStackTrace();
            return new ResponseEntity<>(resp, HttpStatus.OK);
        }
    }

    @GetMapping("/gtLogs")
    public ResponseEntity<?> getSysLogs() {
        try {
            List<RptSysLogs> userGroups = sysLogService.getSysLogs();

            if (userGroups.isEmpty()) {
                return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "404",
                        false, "cannot find usergroups",
                        new HashSet<>(userGroups)), HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "000", true, "usergroups",
                    new HashSet<>(userGroups)), HttpStatus.OK);
        } catch (Exception e) {
            GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
            e.printStackTrace();
            return new ResponseEntity<>(resp, HttpStatus.OK);
        }
    }

    @GetMapping("/getSystemActivity")
    public ResponseEntity<?> previewCustomers(
            @RequestParam("FromDt")
            @DateTimeFormat(pattern = "yyyy-MM-dd")
                    Date fromDate,
            @RequestParam(value = "ToDt")
            @DateTimeFormat(pattern = "yyyy-MM-dd")
                    Date toDate,
            @RequestParam(value = "userId")
                    Long userId
    ) {
        List<RptSysLogs> logs = sysLogService.gtSystemLogs(fromDate, toDate, userId);
        if (logs.size() > 0) {
            return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "000",
                    true, "logs found",
                    new HashSet<>(logs)), HttpStatus.OK);
        }
        return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "000",
                true, "logs found",
                new HashSet<>(logs)), HttpStatus.OK);
    }

    @GetMapping("/getSystemActivityForExporting")
    public String previewCustomersForExporting(
            @RequestParam("FromDt")
            @DateTimeFormat(pattern = "yyyy-MM-dd")
                    Date fromDate,
            @RequestParam(value = "ToDt")
            @DateTimeFormat(pattern = "yyyy-MM-dd")
                    Date toDate,
            @RequestParam(value = "userId")
                    Long userId) {
        List<RptSysLogs> logs = sysLogService.gtSystemLogs(fromDate, toDate, userId);
        String response = "";
        response += "username, ";
        response += "activity, ";
        response += "actTime, ";
        response += "actDate";
        response += "\n";
        for (RptSysLogs log : logs) {
            response += log.getUsername() + ", ";
            response += log.getActivity() + ", ";
            response += log.getActTime() + ", ";
            response += log.getActDate() + "";
            response += "\n";
        }
        response += "\n";
        if (logs.size() > 0) {
            return response;
        } else {
            return "logs not found";
        }
    }
}
