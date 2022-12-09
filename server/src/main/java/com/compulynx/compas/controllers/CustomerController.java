package com.compulynx.compas.controllers;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;

import javax.net.ssl.HttpsURLConnection;

import com.compulynx.compas.mail.EmailSender;
import com.compulynx.compas.models.extras.*;
import com.compulynx.compas.models.t24Models.CustomerDetails;
import com.compulynx.compas.models.t24Models.CustomerReqObject;
import com.compulynx.compas.models.t24Models.CustomerStaffUpdateRes;
import com.compulynx.compas.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.compulynx.compas.customs.Api;
import com.compulynx.compas.customs.HttpRestProccesor;
import com.compulynx.compas.customs.responses.CustomerResponse;
import com.compulynx.compas.customs.responses.GlobalResponse;
import com.compulynx.compas.models.Customer;
import com.compulynx.compas.models.Teller;
import com.compulynx.compas.models.UserGroup;
import com.compulynx.compas.services.CustomerService;
import com.compulynx.compas.services.TellerService;
import com.compulynx.compas.services.UserGroupService;

@RestController
@RequestMapping(value = Api.REST)
public class CustomerController {
	private static final Logger log = LoggerFactory.getLogger(TellerController.class);
	
	private static HttpsURLConnection httpsURLConnection;
	private static BufferedReader reader;
	private static String line="";

	@Autowired
	private Environment env;

	@Autowired
	private CustomerService customerService;

	@Autowired
	private TellerService tellerService;

	@Autowired
	private UserService userService;

	@Autowired
	private UserGroupService userGroupService;

	@Autowired
	private EmailSender emailSender;
	
	@PostMapping("customer_inquiry")
	public ResponseEntity<?> getCustomerFromT24(@RequestBody Customer customer) {

		if(customer.getMnemonic() =="" || customer.getMnemonic() == null) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request: staffid is missing", false, GlobalResponse.APIV);
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
		
		return customerService.t24CustomerInquiry(customer);
			
	}	

	@GetMapping(value = "/gtCustomers")
	public ResponseEntity<?> getCustomers() {
		try {
			List<Customer> customers = customerService.getCustomers();
			if (customers.size() > 0) {
				return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "000", true, "customers found",
						new HashSet<>(customers)), HttpStatus.OK);
			}
			return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "201", false, "no customers found",
					new HashSet<>(customers)), HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "/getMatchedCustomers")
	public ResponseEntity<?> identifyCustomers(@RequestBody List<Customer> customers) {
		try {
			List<Customer> custs = new ArrayList<>();
			for (Customer cus : customers) {
				Customer cust = customerService.getMatchedCustomers(cus.getCustomerId());
				if (cust != null) {
					custs.add(cust);
				} else {
					MatchingTeller teller = customerService.getMatchedTellers(cus.getCustomerId());
					if (teller != null) {
						Customer tel = new Customer();
						tel.setId(teller.getId());
						tel.setCustomerId(teller.getCustomerId());
						tel.setCustomerIdNumber(teller.getCustomerIdNumber());
						tel.setCustomerName(teller.getCustomerName());
						tel.setGender(teller.getGender());
						tel.setPhoneNumber(teller.getPhoneNumber());
						tel.setCountry(teller.getCountry());
						custs.add(tel);
					}
				}
			}

			if (customers.size() > 0) {
				return new ResponseEntity<>(
						new GlobalResponse(GlobalResponse.APIV, "000", true, "customers found", new HashSet<>(custs)),
						HttpStatus.OK);
			}
			return new ResponseEntity<>(
					new GlobalResponse(GlobalResponse.APIV, "201", false, "no customers found", new HashSet<>(custs)),
					HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "/identifyCustomer")
	public ResponseEntity<?> identifyCustomer(@RequestBody Customer customer) {
		try {
			Customer cust = customerService.identifyCustomer(customer.getCustomerId());
			if (!(cust.equals(null))) {
				return new ResponseEntity<>(new CustomerResponse("000", "customer", true, GlobalResponse.APIV, cust),
						HttpStatus.OK);
			}
			return new ResponseEntity<>(
					new CustomerResponse("201", "customer not found", false, GlobalResponse.APIV, cust), HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "/checkCustomer")
	public ResponseEntity<?> checkCustomer(@RequestBody Customer customer) {
		try {
			System.out.println("gif" + customer.getMnemonic());
			Customer cust = customerService.checkCustomer(customer.getMnemonic(), customer.getMnemonic());
			if (cust != null) {
				return new ResponseEntity<>(new GlobalResponse("000", "customer found", true, GlobalResponse.APIV),
						HttpStatus.OK);
			} else {
				return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "201", false, "no customers found"),
						HttpStatus.OK);
			}
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "/obtainCustomerDetails")
	public ResponseEntity<?> obtainCustomerDetails(@RequestBody Customer customer) {
		try {
			Customer cust = customerService.checkCustomer(customer.getMnemonic(), customer.getMnemonic());
			if (cust != null) {
				return new ResponseEntity<>(
						new CustomerResponse("000", "customer found", true, GlobalResponse.APIV, cust), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(
						new CustomerResponse("201", "customer not found", false, GlobalResponse.APIV, cust),
						HttpStatus.OK);

			}
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping({ "/upCustomerDetails" })
	public ResponseEntity<?> upCustomerDetails(@RequestBody Customer customer) {
		try {
			Customer cust = null;
			int customerUndeleted = 0;
			if (customerService.checkCustomerDeleted(customer.getCustomerId()) != null) {
				customerUndeleted = customerService.customerUnDelete(customer.getCreatedBy(), customer.getCustomerId());
			} else {
				cust = customerService.upCustomerDetails(customer);
			}
			if (cust != null || customerUndeleted > 0) {

				return new ResponseEntity(new GlobalResponse("000", "customer found", true, "1.0.0"), HttpStatus.OK);
			}

			return new ResponseEntity(new GlobalResponse("1.0.0", "201", false, "no customers found"), HttpStatus.OK);
		} catch (Exception e) {
			log.error("Error in proccesing ", e);
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, "1.0.0");

			return new ResponseEntity(resp, HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping(value = "/approveCustomer")
	public ResponseEntity<?> approveCustomer(@RequestBody Customer customer) {
		
		
		log.info("/approveCustomer!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		
        try {
//            String t24Url = env.getProperty("tserver") + customer.getCustomerId() + "/true";
            String t24Url = env.getProperty("tserver");

            String customerId = customer.getCustomerId();
            log.info("update url for " + t24Url);

			System.out.println("update url for " + t24Url);
			
			GlobalResponse response = customerService.updateCustomerAndStaff(t24Url, customerId,"TRUE");            

            log.info("T24 response response " + response.getRespMessage());
            if(response.getRespCode() != "200"){
                return new ResponseEntity<>(new GlobalResponse(response.getRespCode(), response.getRespMessage(), false,GlobalResponse.APIV),
                        HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            log.error("Error in proccesing ", e);
            return new ResponseEntity<>(new GlobalResponse("500", "HpptRestProcessor Exception", false, GlobalResponse.APIV),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }

		try {
			int cust = customerService.approveCustomer(customer.getCreatedBy(), customer.getCustomerId());

			if (cust > 0) {
				// send email after approving the customer
				String recipient = customer.getEmail();
				if(recipient == null) {
					log.info("Email for " + customer.getCustomerName() + " is null");
				}else if(!recipient.contains("@")){
					// if the email does not contain the "@" sign, then it is likely that
					// the t24 endpoint returned a string of "email not available" or similar
					// denoting that the customer does not have an email address
					log.info("Email for " + customer.getCustomerName() + " is not available");
				}else {
					String subject = "Biometric Details of Customer Captured";
					String emailContent = "Dear " + customer.getCustomerName() + ", your biometric details have been successfully registered. For any queries please call 0711087000 or 0732187000.";
					emailSender.sendEmail(recipient, subject, emailContent);
					log.info("Email to customer scheduled to be sent to " + customer.getCustomerName());
				}

				// send sms after approving customer using REST
				String smsUrl = env.getProperty("smsUrl");
                String customerName = customer.getCustomerName();
                String phoneNumber = customer.getPhoneNumber();
                String smsApiUsername = env.getProperty("smsApiUsername");
                String smsApiPassword = env.getProperty("smsApiPassword");
                String getResponse = HttpRestProccesor.sendGetRequest(smsUrl, "sms", customerName, phoneNumber, smsApiUsername, smsApiPassword);
				log.info("SMS Get Request Response is: "+  getResponse);

				return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "000", true,
						"customer  " + customer.getCustomerId() + " verified successfully"), HttpStatus.OK);

			}
			return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "201", false, "no customers found"),
					HttpStatus.OK);

		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping(value = "/customersToApprove")
	public ResponseEntity<?> getCustomersToApprove(@RequestBody Customer customer) {
		try {
			System.out.println("Branch Code: " + customer.getBranchCode());
			System.out.println("Right ID: " + customer.getVerifiedBy());
			UserGroup userGroup = userGroupService.getRightCode(Long.valueOf(customer.getVerifiedBy()));
			List<CustomersToApprove> customers = null;
			// Do not filter for sys admins and regional supervisor checkers
			if (userGroup.getGroupCode().equalsIgnoreCase("G003")
					|| userGroup.getGroupCode().equalsIgnoreCase("G004")) {
				customers = customerService.getCustomersToVerifyAll();
			} else {
				customers = customerService.getCustomersToVerify(customer.getBranchCode());
			}

			if (customers.size() > 0) {
				return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "000", false,
						"customers to verify found", new HashSet<>(customers)), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "201", false,
						"no customers to verify found", new HashSet<>(customers)), HttpStatus.OK);
			}
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@GetMapping(value = "/customersToApproveDetach")
	public ResponseEntity<?> getCustomersToApproveDetach() {
		try {
			List<CustomersToApproveDetach> customers = customerService.getCustomersToApproveDetach();
			if (customers.size() > 0) {
				return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "000", true,
						"customers to approve detach found", new HashSet<>(customers)), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "201", false,
						"no customers to approve detach found", new HashSet<>(customers)), HttpStatus.OK);
			}
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "/gtCustomerToWaive")
	public ResponseEntity<?> getCustomerToWaive(@RequestBody Customer customerId) {
		try {
			Customer cust = customerService.checkCustomer(customerId.getCustomerId(), customerId.getCustomerId());
			System.out.println("customer###" + cust.getVerified());
			if (cust.getWaived().equalsIgnoreCase("N")) {
				return new ResponseEntity<>(new CustomerResponse("201",
						"customer with specified id is not yet VERIFIED, " + " kindly verify to proceed!", true,
						GlobalResponse.APIV, cust), HttpStatus.OK);
			}
			if (cust.getWaived().equalsIgnoreCase("W")) {
				return new ResponseEntity<>(new CustomerResponse("201", "customer with specified id is already waived",
						false, GlobalResponse.APIV, cust), HttpStatus.OK);
			}
			if (cust.getWaived().equalsIgnoreCase("A")) {
				return new ResponseEntity<>(new CustomerResponse("201",
						"customer with specified id is already waived and approved", false, GlobalResponse.APIV, cust),
						HttpStatus.OK);
			}
			return new ResponseEntity<>(
					new CustomerResponse("201", "customer not found", false, GlobalResponse.APIV, cust), HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "customer with specified id not found", false,
					GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@GetMapping(value = "/gtWaivedCustomers")
	public ResponseEntity<?> getWaivedCustomers() {
		try {
			List<Customer> customers = customerService.getWaiveCustomers();
			if (customers.size() > 0) {
				return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "000", true, "customers found",
						new HashSet<>(customers)), HttpStatus.OK);
			}
			return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "201", false, "no customers found",
					new HashSet<>(customers)), HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "/waiveCustomer")
	public ResponseEntity<?> waiveCustomer(@RequestBody Customer customer) {
		try {
			System.out.println("gif" + customer.getCustomerId());
			int cust = customerService.waiveCustomer(customer.getWaivedBy(), customer.getCustomerId());
			if (cust > 0) {
				return new ResponseEntity<>(
						new GlobalResponse("000", "customer waived successfully", true, GlobalResponse.APIV),
						HttpStatus.OK);
			} else {
				return new ResponseEntity<>(
						new GlobalResponse(GlobalResponse.APIV, "201", false, "failed to update customer details"),
						HttpStatus.OK);
			}
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing customer details request", false,
					GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "/approveCustomerWaive")
	public ResponseEntity<?> approveCustomerWaive(@RequestBody Customer customer) {
		try {
			System.out.println("gif" + customer.getCustomerId());
			int cust = customerService.approveCustomerWaive(customer.getWaived(), customer.getWaivedApprovedBy(),
					customer.getCustomerId());
			if (cust > 0) {
				return new ResponseEntity<>(
						new GlobalResponse("000", "customer details updated successfully", true, GlobalResponse.APIV),
						HttpStatus.OK);
			} else {
				return new ResponseEntity<>(
						new GlobalResponse(GlobalResponse.APIV, "201", false, "failed to update customer details"),
						HttpStatus.OK);
			}
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing customer details request", false,
					GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "/rejectCustomerWaive")
	public ResponseEntity<?> rejectCustomerWaive(@RequestBody Customer customer) {
		try {
			System.out.println("cif" + customer.getCustomerId());
			int cust = customerService.rejectCustomerWaive(customer.getWaivedApprovedBy(), customer.getCustomerId());
			if (cust > 0) {
				return new ResponseEntity<>(
						new GlobalResponse("000", "customer details updated successfully", true, GlobalResponse.APIV),
						HttpStatus.OK);
			} else {
				return new ResponseEntity<>(
						new GlobalResponse(GlobalResponse.APIV, "201", false, "failed to reject  customer waive"),
						HttpStatus.OK);
			}
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing customer details request", false,
					GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "/rejectCustomerEnrollment")
	public ResponseEntity<?> rejectCustomerEnrollment(@RequestBody Customer customer) {
		try {
			int updates = customerService.rejectCustomerEnrollment(customer.getRejectedBy(), customer.getCustomerId());
			if (updates > 0) {
				return new ResponseEntity<>(
						new GlobalResponse("000", "Customer rejected successfully", true, GlobalResponse.APIV),
						HttpStatus.OK);
			} else {
				return new ResponseEntity<>(
						new GlobalResponse(GlobalResponse.APIV, "201", false, "Customer not successfully rejected"),
						HttpStatus.OK);
			}
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404",
					"An Exception occurred while attempting to reject the customer", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@GetMapping("/previewCustomers")
	public ResponseEntity<?> previewCustomers(
			@RequestParam("FromDt") @DateTimeFormat(pattern = "yyyy-MM-dd") Date fromDate,
			@RequestParam(value = "ToDt") @DateTimeFormat(pattern = "yyyy-MM-dd") Date toDate,
			@RequestParam(value = "enrolledType") String enrolledType, @RequestParam(value = "branchCode") String branchCode,
            @RequestParam(value = "groupid") String groupId) {
		try {
            List<Customer> customers;
            UserGroup userGroup = userGroupService.getRightCode(Long.valueOf(groupId));
            // the system administrators to be able to view all the reports
            if (userGroup.getGroupCode().equalsIgnoreCase("G003")
                    || userGroup.getGroupCode().equalsIgnoreCase("G004")) {
                customers = customerService.gtEnrolledCustomers(fromDate, toDate, enrolledType);
            }else{
                // other system users to view reports based on their branches
                customers = customerService.getEnrolledCustomersByBranch(fromDate, toDate, enrolledType, branchCode);
            }
			if (customers.size() > 0) {
				return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "000", true, "customers found",
						new HashSet<>(customers)), HttpStatus.OK);
			}
			return new ResponseEntity<>(
					new GlobalResponse(GlobalResponse.APIV, "000", true, "customers found", new HashSet<>(customers)),
					HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing customer details request", false,
					GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "/deleteCustomer")
	public ResponseEntity<?> deleteCustomer(@RequestBody Customer customer) {
		try {
			int cust = customerService.deleteCustomer(customer.getDeletedBy(), customer.getCustomerId());

			if (cust > 0) {
				return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "000", true,
						"customer  " + customer.getCustomerId() + " deleted successfully"), HttpStatus.OK);

			}
			return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "201", false, "no customers found"),
					HttpStatus.OK);

		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "/approveRemoveCustomer")
	public ResponseEntity<?> approveRemoveCustomer(@RequestBody Customer customer) {
		try {
			String t24Url = env.getProperty("tserver") + customer.getCustomerId() + "/false";
			String customerId = customer.getCustomerId();
            log.info("update url for " + t24Url);

			String response = HttpRestProccesor.postJson(t24Url, customerId);

			log.info("T24 response: " + response);
			if(response.equals("failed")){
				log.error("Accessing the T24 endpoint in approveRemoveCustomer has failed");
			}
		} catch (Exception e) {
			log.error("Exception while accessing the T24 endpoint in approveRemoveCustomer ", e);
		}

		try {
			int cust = customerService.approveRemoveCustomer(customer.getCustomerId());

			if (cust > 0) {
				return new ResponseEntity<>(
						new GlobalResponse(GlobalResponse.APIV, "000", true,
								"removal of customer  " + customer.getCustomerId() + " approved successfully"),
						HttpStatus.OK);

			}
			return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "201", false, "no customers found"),
					HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "/rejectRemoveCustomer")
	public ResponseEntity<?> rejectRemoveCustomer(@RequestBody Customer customer) {
		try {
			int cust = customerService.rejectRemoveCustomer(customer.getCustomerId());

			if (cust > 0) {
				return new ResponseEntity<>(
						new GlobalResponse(GlobalResponse.APIV, "000", true,
								"removal of customer  " + customer.getCustomerId() + " rejected successfully"),
						HttpStatus.OK);

			}
			return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "201", false, "no customers found"),
					HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "convertStaffToCustomer")
	public ResponseEntity<?> convertStaffToCustomer(@RequestBody Customer customerRequestBody) {
		try {
			// create the new customer based on the details obtained from the staff details
			Customer customer = null;
			int customerUndeleted = 0;
			if (customerService.checkCustomerDeleted(customerRequestBody.getCustomerId()) != null) {
				customerUndeleted = customerService.customerUnDelete(customerRequestBody.getCreatedBy(),
						customerRequestBody.getCustomerId());
			} else {
				customer = customerService.upCustomerDetails(customerRequestBody);
			}
			if (customer != null || customerUndeleted > 0) {
				int conversionUpdateReturnValue = this.tellerService
						.convertStaffToCustomer(customerRequestBody.getCustomerId());
				if (conversionUpdateReturnValue > 0) {
					Teller teller = tellerService.checkStaffDeleted(customerRequestBody.getCustomerIdNumber());
					if (teller != null) {
						int userStatusUpdate = userService.updateStatusToFalse(teller.getTellerSignOnName());
						if (userStatusUpdate > 0) {
							return new ResponseEntity<>(new GlobalResponse("000",
									"Conversion of Staff to Customer done successfully", true, GlobalResponse.APIV),
									HttpStatus.OK);
						} else {
							return new ResponseEntity<>(
									new GlobalResponse("201", "Conversion of Staff to Customer not done successfully",
											false, GlobalResponse.APIV),
									HttpStatus.OK);
						}
					} else {
						return new ResponseEntity<>(
								new GlobalResponse("201", "Teller not found", false, GlobalResponse.APIV),
								HttpStatus.OK);
					}

				} else {
					return new ResponseEntity<>(new GlobalResponse("201",
							"Conversion of Staff to Customer not done successfully", false, GlobalResponse.APIV),
							HttpStatus.OK);
				}
			} else {
				return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "201", false,
						"Error occurred while attempting to create the customer when converting staff to customer"),
						HttpStatus.OK);
			}

		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404",
					"An Exception occurred when attempting to covert staff to customer", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@GetMapping("/getCustomerLogsForExporting")
	public String getCustomerLogsForExporting(
			@RequestParam("FromDt") @DateTimeFormat(pattern = "yyyy-MM-dd") Date fromDate,
			@RequestParam(value = "ToDt") @DateTimeFormat(pattern = "yyyy-MM-dd") Date toDate,
			@RequestParam(value = "enrolledType") String enrolledType) {
		try {
			List<Customer> customers = customerService.gtEnrolledCustomers(fromDate, toDate, enrolledType);
			String response = "";
			response += "Full Name, ";
			response += "Gender, ";
			response += "Phone Number, ";
			response += "Id Number";
			response += "\n";
			for (Customer customer : customers) {
				response += customer.getCustomerName() + ", ";
				response += customer.getGender() + ", ";
				response += customer.getPhoneNumber() + ", ";
				response += customer.getCustomerIdNumber() + "";
				response += "\n";
			}
			response += "\n";
			if (customers.size() > 0) {
				return response;
			} else {
				return "logs not found";
			}
		} catch (Exception e) {
			return "Exception while creating customer logs";
		}
	}
}
