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

import com.compulynx.compas.models.extras.CustomersToApproveDetach;

import com.compulynx.compas.security.AESsecure;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.compulynx.compas.controllers.CommonFunctions;
import com.compulynx.compas.customs.HttpRestProccesor;
import com.compulynx.compas.customs.responses.GlobalResponse;
import com.compulynx.compas.models.Customer;
import com.compulynx.compas.models.Teller;
import com.compulynx.compas.models.extras.CustomersToApprove;
import com.compulynx.compas.models.extras.MatchingTeller;
import com.compulynx.compas.models.t24Models.CustomerDetails;
import com.compulynx.compas.models.t24Models.CustomerReqObject;
import com.compulynx.compas.models.t24Models.CustomerStaffUpdateRes;
import com.compulynx.compas.models.t24Models.T24UpdateParams;
import com.compulynx.compas.models.t24Models.T24UpdateReqObject;
import com.compulynx.compas.repositories.CustomerRepository;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

@Service
public class CustomerService {
	
	 private static final Logger log = LoggerFactory.getLogger(CustomerService.class);
	
	private static HttpsURLConnection httpsURLConnection;
	private static BufferedReader reader;
	private static String line="";

	@Autowired
	private Environment env;

	@Autowired
	private CustomerRepository customerRepository;

	public List<Customer> getCustomers() {
		// TODO Auto-generated method stub
		return customerRepository.findAll();
	}

	public Customer checkCustomer(String gifNumber, String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.findCustomerByCustomerId(gifNumber, customerId);
	}

	public Customer upCustomerDetails(Customer customer) {
		Optional<Customer> byCustomerId = customerRepository.findByCustomerId(customer.getCustomerId());
		if(byCustomerId.isPresent()){
			log.info("Customer "+customer.getCustomerId() +" already exist!");
			log.info("Updating customer details....");
			customer.setId(byCustomerId.get().getId());
			return customerRepository.save(customer);
		}
		log.info("Save customer details....");
		return customerRepository.save(customer);
	}

	public List<CustomersToApprove> getCustomersToVerify(String branchCode) {
		return customerRepository.getCustomersToApprove(branchCode);
	}

	public List<CustomersToApprove> getCustomersToVerifyAll() {
		return customerRepository.getCustomersToApproveAll();
	}



	public int approveCustomer(int verifiedBy, String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.approveCustomers(verifiedBy, customerId);
	}

	public Customer identifyCustomer(String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.identifyCustomer(customerId);
	}

	public Customer getCustomerToWaive(String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.getCustomerToWaive(customerId);
	}

	public int waiveCustomer(int waivedBy, String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.waiveCustomer(waivedBy, customerId);
	}

	public List<Customer> getWaiveCustomers() {
		// TODO Auto-generated method stub
		return customerRepository.getWaiveCustomers();
	}

	public int approveCustomerWaive(String waived, int approvedBy, String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.approveCustomerWaive(waived, approvedBy, customerId);
	}

	public Customer getMatchedCustomers(String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.getMatchedCustomers(customerId);
	}

	public MatchingTeller getMatchedTellers(String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.getMatchedTellers(customerId);
	}

	public int rejectCustomerWaive(int waivedApprovedBy, String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.rejeCustomerWaive(waivedApprovedBy, customerId);
	}

	public List<Customer> gtEnrolledCustomers(Date fromDate, Date toDate, String enrolledType) {
		// TODO Auto-generated method stub
		System.out.println("from date: " + fromDate);
		System.out.println("to date: " + toDate);
		System.out.println("enrolled type: " + enrolledType);
		return customerRepository.getEnrolledCustomers(fromDate, toDate, enrolledType);
	}

	public List<Customer> getEnrolledCustomersByBranch(Date fromDate, Date toDate, String enrolledType,
													   String branchCode) {
		return customerRepository.getEnrolledCustomersByBranch(fromDate, toDate, enrolledType, branchCode);
	}

//	public Customer getCustomerToVerify(String mnemonic, String mnemonic2) {
//		// TODO Auto-generated method stub
//		return customerRepository.getCustomerToVerify(mnemonic, mnemonic2);
//	}
//
//	public int updateCustomerStatus(String customerId) {
//		// TODO Auto-generated method stub
//		return customerRepository.updateCustomerDetails(customerId);
//	}
//
//	public int removeCustomerPrints(Long profileId) {
//		// TODO Auto-generated method stub
//		return customerRepository.removeCustomerPrints(profileId);
//	}

//	public int removeCustomerProfile(String customerId) {
//		// TODO Auto-generated method stub
//		return customerRepository.removeCustomerDetails(customerId);
//	}

	public int upgradeCustomerProfile(String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.upgradeCustomerDetails(customerId);
	}

	public int rejectCustomerEnrollment(int rejectedBy, String customerId) {
		return customerRepository.rejectCustomerEnrollment(rejectedBy, customerId);
	}

	public int deleteCustomer(int deletedBy, String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.deleteCustomer(deletedBy, customerId);
	}

//	public List<Customer> gtEnrolledCustomers(Date fromDate, Date toDate) {
//		// TODO Auto-generated method stub
//		return customerRepository.getAll(fromDate,toDate);
//	}

	public List<CustomersToApproveDetach> getCustomersToApproveDetach() {
		return customerRepository.getCustomersToApproveDetach();
	}

	public int approveRemoveCustomer(String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.approveRemoveCustomer(customerId);
	}

	public int rejectRemoveCustomer(String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.rejectRemoveCustomer(customerId);
	}

	public Customer checkCustomerDeleted(String customerId) {
		return customerRepository.checkCustomerDeleted(customerId);
	}

	public int customerUnDelete(int createdBy, String customerId) {
		return customerRepository.customerUnDelete(createdBy, customerId);
	}
	public GlobalResponse updateCustomerAndStaff(String url, String customerID,String updateStatus) {
    	log.info("updateCustomerAndStaff called!");
    	
    	try {		
			if(url =="" || customerID == null) {
				GlobalResponse resp = new GlobalResponse("404", "error processing request: customerid is missing", false, GlobalResponse.APIV);
				return resp;
			}				
			CommonFunctions.disableSslVerification();
			log.info("updateCustomerAndStaff  disabled SSL!");
			StringBuffer customerAndStaffBuffer = new StringBuffer();
			URL custAndStaffUrl = new URL(url);				
			httpsURLConnection = (HttpsURLConnection)custAndStaffUrl.openConnection();
			log.info("updateCustomerAndStaff: CONN OPENNED !");
			
			CommonFunctions.configHttpsUrlConnection(httpsURLConnection);
			httpsURLConnection.addRequestProperty("Content-Type", "application/json");          
	      
	        OutputStream getCustAndStaffOs = httpsURLConnection.getOutputStream();
	        log.info("updateCustomerAndStaff OUTPUT STRING RETURNED ");
	        
	        OutputStreamWriter getCustAndStaffOsw = new OutputStreamWriter(getCustAndStaffOs, "UTF-8");  
	       // env.getProperty("cobankingAuthName"),env.getProperty("cobankingAuthPass")
	        //"I0w8NjGOG/SIY2GgkiSU0w==","p6wS7JpG9FCD8Ic+tntr9Q=="
	        
	        T24UpdateReqObject object = new T24UpdateReqObject(env.getProperty("cobankingAuthName"),env.getProperty("cobankingAuthPass"),new T24UpdateParams(customerID,updateStatus));
	        
	        String json = new Gson().toJson(object);
	        
	        if(json != null) {
	        	getCustAndStaffOsw.write(json);						
	        	getCustAndStaffOsw.flush();
	        	getCustAndStaffOsw.close();  
	        } 
	        			       
			int status = httpsURLConnection.getResponseCode();
			
			log.info("updateCustomerAndStaff - RESPONSE CODE: "+status);
			
			if(status == 200) {
				System.out.println("200: updateCustomerAndStaff!!!!!!!!!!!!!!!!!!!!!!!!!");
				reader = new BufferedReader(new InputStreamReader(httpsURLConnection.getInputStream()));						
				while((line = reader.readLine()) != null) {
					customerAndStaffBuffer.append(line);
				}
				reader.close();
				httpsURLConnection.disconnect();
				
				ObjectMapper mapper = new ObjectMapper();
				CustomerStaffUpdateRes resBody = mapper.readValue(customerAndStaffBuffer.toString(), CustomerStaffUpdateRes.class);	
				System.out.println("customerAndStaffBuffer :::::::::::::::::::::::"+resBody.toString());
				if(resBody.getErrorCode() != null && resBody.getErrorCode() != "") {
					System.out.println("IF THERE'S AN ERROR :::::::::::::::");
					GlobalResponse resp = new GlobalResponse(resBody.getErrorCode(), resBody.getErrorMessage(), false, GlobalResponse.APIV);
					 return resp; 
				}
				System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! "+resBody.getPayload().toString());
				//(String respCode, String respMessage, boolean status, String version)
				GlobalResponse resp = new GlobalResponse("200",resBody.getPayload().getStatus(), false, GlobalResponse.APIV);
				System.out.println("SUCCESS:::::::::::::::::::::::"+resp.getRespCode() +" RESP MESSAGE:::::"+resp.getRespMessage());
				 return resp;
					
			}else {
				System.out.println("DID NOT RETURN 200::::::::::::::::::::::::::::::::::::");
				GlobalResponse resp = new GlobalResponse("500", "T24 did not return a valid response!", false, GlobalResponse.APIV);
				return resp;
			}	
	
		}catch(MalformedURLException e) {
			e.printStackTrace();
			GlobalResponse resp = new GlobalResponse("500", "T24 endpoints not reachable", false, GlobalResponse.APIV);
			return resp;
			
		}catch(IOException ev) {
			ev.printStackTrace();
			GlobalResponse resp = new GlobalResponse("500", "T24 endpoints not reachable", false, GlobalResponse.APIV);
			return resp;
		}catch (Exception exception) {
			exception.printStackTrace();
			GlobalResponse resp = new GlobalResponse("500", "T24 endpoints not reachable", false, GlobalResponse.APIV);
			return resp;
		} 	
    }

	public ResponseEntity<?> t24CustomerInquiry(Customer customer) {	
		log.error("t24CustomerInquiry!");
		String responsePayload ="";
		try {
		
			String customerInqEndpoint = env.getProperty("customerInqEndpoint");
			
			CommonFunctions.disableSslVerification();
			StringBuffer getCustomerDetailsBuffer = new StringBuffer();
			URL customerDetailsUrl = new URL(customerInqEndpoint);				
			httpsURLConnection = (HttpsURLConnection)customerDetailsUrl.openConnection();
			CommonFunctions.configHttpsUrlConnection(httpsURLConnection);
			httpsURLConnection.addRequestProperty("Content-Type", "application/json");          
	      
	        OutputStream getCustDetsOs = httpsURLConnection.getOutputStream();
	        OutputStreamWriter getCustDetsOsw = new OutputStreamWriter(getCustDetsOs, "UTF-8");  
	        
	        com.compulynx.compas.models.t24Models.Customer cust = new com.compulynx.compas.models.t24Models.Customer();
	        cust.setMnemonic(customer.getMnemonic());
	        CustomerReqObject custReqObj = new CustomerReqObject(env.getProperty("cobankingAuthName"),env.getProperty("cobankingAuthPass"),cust);
	        
	        String getCustDetReqString = CommonFunctions.convertPojoToJson(custReqObj);
	        if(getCustDetReqString != null) {
	        	getCustDetsOsw.write(getCustDetReqString);						
	        	getCustDetsOsw.flush();
	        	getCustDetsOsw.close();  
	        } 
	        			       
			int status = httpsURLConnection.getResponseCode();
			
			if(status == 200) {
				reader = new BufferedReader(new InputStreamReader(httpsURLConnection.getInputStream()));						
				while((line = reader.readLine()) != null) {
					getCustomerDetailsBuffer.append(line);
				}
				reader.close();
				httpsURLConnection.disconnect();
				
				ObjectMapper mapper = new ObjectMapper();
				CustomerDetails custDetails = mapper.readValue(getCustomerDetailsBuffer.toString(), CustomerDetails.class);	
				log.error("Customer inquiry successfull!");
				responsePayload = AESsecure.encrypt(new Gson().toJson(custDetails).toString());
				return new ResponseEntity<>(responsePayload, HttpStatus.OK);
			}else {
				log.error("Customer not found!");
				GlobalResponse resp = new GlobalResponse("404", "Customer not found!", false, GlobalResponse.APIV);
				responsePayload = AESsecure.encrypt(new Gson().toJson(resp).toString());
				return new ResponseEntity<>(responsePayload, HttpStatus.NOT_FOUND);
			}

	}catch(MalformedURLException e) {
		log.error("MalformedURLException: ", e.getMessage());
		GlobalResponse resp = new GlobalResponse("500", "T24 endpoint is unreachable", false, GlobalResponse.APIV);
			responsePayload = AESsecure.encrypt(new Gson().toJson(resp).toString());
		return new ResponseEntity<>(responsePayload, HttpStatus.INTERNAL_SERVER_ERROR);
	}catch(IOException ev) {
		log.error("IOException: ", ev.getMessage());
		GlobalResponse resp = new GlobalResponse("500", "T24 endpoint is unreachable", false, GlobalResponse.APIV);
			responsePayload = AESsecure.encrypt(new Gson().toJson(resp).toString());
		return new ResponseEntity<>(responsePayload, HttpStatus.INTERNAL_SERVER_ERROR);
	}catch (Exception exception) {
		log.error("Exception: ", exception.getMessage());
		GlobalResponse resp = new GlobalResponse("500", "T24 endpoint is unreachable", false, GlobalResponse.APIV);
			responsePayload = AESsecure.encrypt(new Gson().toJson(resp).toString());
		return new ResponseEntity<>(responsePayload, HttpStatus.INTERNAL_SERVER_ERROR);
	}
		
	}

}

