package com.compulynx.compas.services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.net.ssl.HttpsURLConnection;

import com.compulynx.compas.customs.responses.GeneralResponse;
import com.compulynx.compas.models.extras.TellersToApproveDetach;
import com.compulynx.compas.models.t24Models.Staff;
import com.compulynx.compas.models.t24Models.StaffDetails;
import com.compulynx.compas.models.t24Models.StaffReqObject;

import com.compulynx.compas.security.AESsecure;
import com.google.gson.Gson;
import org.jfree.util.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.compulynx.compas.controllers.CommonFunctions;
import com.compulynx.compas.customs.responses.GlobalResponse;
import com.compulynx.compas.models.Teller;
import com.compulynx.compas.models.extras.TellerToApprove;
import com.compulynx.compas.repositories.TellerRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class TellerService {
	
	private static HttpsURLConnection httpsURLConnection;
	private static BufferedReader reader;
	private static String line="";

	@Autowired
	private Environment env;
	
	@Autowired
	private TellerRepository tellerRepository;

	public Teller checkTeller(String tellerId) {
		// TODO Auto-generated method stub
		return tellerRepository.checkTeller(tellerId);
	}

	public GeneralResponse upTellerDetails(Teller teller) {
		Optional<Teller> optionalTeller = tellerRepository.findByCustomerId(teller.getCustomerId());
		if(optionalTeller.isPresent())
			return new GeneralResponse("201","Record already exist!");
		tellerRepository.save(teller);
		return new GeneralResponse("200","Record updated successfully!");
	}

	public List<Teller> getTellers() {
		// TODO Auto-generated method stub
		return tellerRepository.findAll();
	}

	public Teller getTeller(String tellr) {
		// TODO Auto-generated method stub
		return tellerRepository.getTellerDetails(tellr);
	}

	public List<Teller> getBranchTellers(String branch) {
		// TODO Auto-generated method stub
		return tellerRepository.getBranchTellers(branch);
	}

	public int approveTeller(int createdBy, String customerId) {
		// TODO Auto-generated method stub
		return tellerRepository.approveTellers(createdBy, customerId);
	}

	// Filtered by branch
	public List<TellerToApprove> getTellersToVerify(String branchCode) {
		// TODO Auto-generated method stub
		return tellerRepository.getTellersToApprove(branchCode);
	}

	// All without filters
	public List<TellerToApprove> getTellersToVerifyAll() {
		// TODO Auto-generated method stub
		return tellerRepository.getTellersToApproveAll();
	}

//	public Teller getTellerToVerify(String customerId, String mnemonic) {
//		// TODO Auto-generated method stub
//		return tellerRepository.getTellerToVerify(customerId, mnemonic);
//	}
//
//	public int updateTellerStatus(String customerId) {
//		// TODO Auto-generated method stub
//		return tellerRepository.updateTellerDetails(customerId);
//	}
//
//	public int removeTellerPrints(Long profileId) {
//		// TODO Auto-generated method stub
//		return this.tellerRepository.removeTellerPrints(profileId);
//	}
//
//	public int removeTellerDetails(String customerId) {
//		// TODO Auto-generated method stub
//		return this.tellerRepository.removeTellerDetails(customerId);
//	}

	public int rejectTellerApproval(int rejectedBy, String customerId) {
		return tellerRepository.rejectTellerApproval(rejectedBy, customerId);
	}

	public int removeTeller(int deletedBy, String customerId) {
		return tellerRepository.removeTeller(deletedBy, customerId);
	}

	public int convertStaffToCustomer(String customerId) {
		return tellerRepository.convertStaffToCustomer(customerId);
	}

	public Teller checkStaffApproved(String tellerId) {
		return tellerRepository.checkStaffApproved(tellerId);
	}

	public Teller checkStaffDeleted(String tellerId) {
		return tellerRepository.checkStaffDeleted(tellerId);
	}

	public int staffUnDelete(int createdBy, String tellerId) {
		return tellerRepository.staffUnDelete(createdBy, tellerId);
	}

	public List<TellersToApproveDetach> getTellersToApproveDetach() {
		return tellerRepository.getTellersToApproveDetach();
	}

	public int approveRemoveTeller(String customerId) {
		return tellerRepository.approveRemoveTeller(customerId);
	}

	public int rejectRemoveTeller(String customerId) {
		return tellerRepository.rejectRemoveTeller(customerId);
	}

	public List<Teller> getEnrolledStaff(Date fromDate, Date toDate, String enrolledType) {
		return tellerRepository.getEnrolledStaff(fromDate, toDate, enrolledType);
	}

    public List<Teller> getEnrolledStaffByBranch(Date fromDate, Date toDate, String enrolledType, String branchCode) {
        return tellerRepository.getEnrolledStaffByBranch(fromDate, toDate, enrolledType, branchCode);
    }

	public ResponseEntity<?> t24StaffInquiry(Staff staf) {
		try {
			String staffInqEndpoint = env.getProperty("staffInqEndpoint");
			
			CommonFunctions.disableSslVerification();
			StringBuffer getStaffDetailsBuffer = new StringBuffer();
			URL staffDetailsUrl = new URL(staffInqEndpoint);				
			httpsURLConnection = (HttpsURLConnection)staffDetailsUrl.openConnection();
			CommonFunctions.configHttpsUrlConnection( httpsURLConnection);
			httpsURLConnection.addRequestProperty("Content-Type", "application/json");          
	      
	        OutputStream getCustDetsOs = httpsURLConnection.getOutputStream();
	        OutputStreamWriter getCustDetsOsw = new OutputStreamWriter(getCustDetsOs, "UTF-8");  
	        
	        Staff staff = new Staff();
	        staff.setId(staf.getId());
	        StaffReqObject staffReqObj = new StaffReqObject(env.getProperty("cobankingAuthName"),env.getProperty("cobankingAuthPass"),staff);
	        
	        String getStaffDetReqString = CommonFunctions.convertPojoToJson(staffReqObj);
	        if(getStaffDetReqString != null) {
	        	getCustDetsOsw.write(getStaffDetReqString);						
	        	getCustDetsOsw.flush();
	        	getCustDetsOsw.close();  
	        } 
	        			       
			int status = httpsURLConnection.getResponseCode();
			
			if(status == 200) {
				reader = new BufferedReader(new InputStreamReader(httpsURLConnection.getInputStream()));						
				while((line = reader.readLine()) != null) {
					getStaffDetailsBuffer.append(line);
				}
				reader.close();
				httpsURLConnection.disconnect();
				
				ObjectMapper mapper = new ObjectMapper();
				StaffDetails staffDetails = mapper.readValue(getStaffDetailsBuffer.toString(), StaffDetails.class);

				String response = AESsecure.encrypt(new Gson().toJson(staffDetails));
				return new ResponseEntity<>(response, HttpStatus.OK);
			}else {
				GlobalResponse resp = new GlobalResponse("404", "Staff not found!", false, GlobalResponse.APIV);
				return new ResponseEntity<>(resp, HttpStatus.NOT_FOUND);
			}	

	}catch(MalformedURLException e) {
		System.out.println("Exception "+e.getMessage());
		
		Log.error(e.getMessage());
		GlobalResponse resp = new GlobalResponse("500", "T24 endpoint is unreachable", false, GlobalResponse.APIV);
		return new ResponseEntity<>(resp, HttpStatus.INTERNAL_SERVER_ERROR);
	}catch(IOException ev) {
		System.out.println("IOException "+ev.getMessage());
		Log.error(ev.getMessage());
	
		GlobalResponse resp = new GlobalResponse("404", "T24 endpoint is unreachable", false, GlobalResponse.APIV);
		return new ResponseEntity<>(resp, HttpStatus.INTERNAL_SERVER_ERROR);
	}catch (Exception exception) {
		System.out.println("Exception "+exception.getMessage());	
		Log.error(exception.getMessage());
		GlobalResponse resp = new GlobalResponse("404", "T24 endpoint is unreachable", false, GlobalResponse.APIV);
		return new ResponseEntity<>(resp, HttpStatus.INTERNAL_SERVER_ERROR);
	}
		
	}

}
