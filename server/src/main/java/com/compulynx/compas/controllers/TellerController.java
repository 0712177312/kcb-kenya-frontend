package com.compulynx.compas.controllers;

import java.util.Date;
import java.util.HashSet;
import java.util.List;

import com.compulynx.compas.mail.EmailSender;
import com.compulynx.compas.models.extras.TellersToApproveDetach;
import com.compulynx.compas.services.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
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
import com.compulynx.compas.customs.HttpRestProccesor;
import com.compulynx.compas.customs.responses.GlobalResponse;
import com.compulynx.compas.customs.responses.TellerResponse;
import com.compulynx.compas.models.Teller;
import com.compulynx.compas.models.UserGroup;
import com.compulynx.compas.models.extras.TellerToApprove;
import com.compulynx.compas.services.CustomerService;
import com.compulynx.compas.services.TellerService;
import com.compulynx.compas.services.UserGroupService;

@RestController
@RequestMapping(value = Api.REST + "/tellers")
public class TellerController {
	private static final Logger log = LoggerFactory.getLogger(TellerController.class);
	@Autowired
	private Environment env;
	@Autowired
	private TellerService tellerService;

	@Autowired
	private CustomerService customerSvc;

	@Autowired
	private UserService userService;

	@Autowired
	private UserGroupService userGroupService;

	@Autowired
	private EmailSender emailSender;

	@GetMapping(value = "/gtTellers")
	public ResponseEntity<?> getTellers() {
		try {
			List<Teller> tellers = tellerService.getTellers();
			if (tellers.size() > 0) {
				return new ResponseEntity<>(
						new GlobalResponse(GlobalResponse.APIV, "000", true, "tellers found", new HashSet<>(tellers)),
						HttpStatus.OK);
			}
			return new ResponseEntity<>(
					new GlobalResponse(GlobalResponse.APIV, "201", false, "no tellers found", new HashSet<>(tellers)),
					HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@GetMapping(value = "/gtBranchTellers")
	public ResponseEntity<?> getBranchTellers(@RequestParam(value = "branch") String branch) {
		try {
			List<Teller> tellers = tellerService.getBranchTellers(branch);
			if (tellers.size() > 0) {
				return new ResponseEntity<>(
						new GlobalResponse(GlobalResponse.APIV, "000", true, "tellers found", new HashSet<>(tellers)),
						HttpStatus.OK);
			}
			return new ResponseEntity<>(
					new GlobalResponse(GlobalResponse.APIV, "201", false, "no tellers found", new HashSet<>(tellers)),
					HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@GetMapping(value = "/gtTeller")
	public ResponseEntity<?> getTellerDetails(@RequestParam(value = "tellr") String tellr) {
		try {
			Teller teller = tellerService.getTeller(tellr);
			if (teller != null) {
				return new ResponseEntity<>(
						new TellerResponse("000", "teller found", true, GlobalResponse.APIV, teller), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(
						new TellerResponse("201", "teller not found", false, GlobalResponse.APIV, teller),
						HttpStatus.OK);
			}
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping({ "/upTellerDetails" })
	public ResponseEntity<?> upCustomerDetails(@RequestBody Teller teller) {
		try {
			System.out.println("####" + teller.getTellerId());
			Teller cust = null;
			int tellerUndeleted = 0;
			if (tellerService.checkStaffDeleted(teller.getTellerId()) != null) {
				tellerUndeleted = tellerService.staffUnDelete(teller.getCreatedBy(), teller.getTellerId());
			} else {
				cust = tellerService.upTellerDetails(teller);
			}
			log.info("teller details updated succesfull for " + teller.getCustomerId());
			if (cust != null || tellerUndeleted > 0) {

				return new ResponseEntity(new GlobalResponse("000", "staff found", true, "1.0.0"), HttpStatus.OK);
			}
			return new ResponseEntity(new GlobalResponse("1.0.0", "201", false, "no staff found"), HttpStatus.OK);
		} catch (Exception e) {
			log.error("upTellerDetails", e);
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, "1.0.0");
			e.printStackTrace();
			return new ResponseEntity(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "/checkTeller")
	public ResponseEntity<?> checkCustomer(@RequestBody Teller teller) {
		try {
			System.out.println("teller id" + teller.getTellerId());
			Teller cust = tellerService.checkTeller(teller.getTellerId());
			if (cust != null) {
				return new ResponseEntity<>(
						new GlobalResponse("000", "teller already enrolled", true, GlobalResponse.APIV), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(
						new GlobalResponse(GlobalResponse.APIV, "201", false, "teller not enrolled"), HttpStatus.OK);
			}
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "/checkStaffApproved")
	public ResponseEntity<?> checkStaffApproved(@RequestBody Teller teller) {
		try {
			Teller cust = tellerService.checkStaffApproved(teller.getTellerId());
			if (cust != null) {
				return new ResponseEntity<>(new TellerResponse("000", "teller found", true, GlobalResponse.APIV, cust),
						HttpStatus.OK);
			} else {
				return new ResponseEntity<>(
						new TellerResponse("201", "teller not found", false, GlobalResponse.APIV, teller),
						HttpStatus.OK);
			}
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

//    @PostMapping(value="/getTellerDetailsToVerify")
//    public ResponseEntity<?> getTellerDetailsToVerify(@RequestBody Teller teller) {
//    	try {
//    	System.out.println("teller id" + teller.getTellerId());
//    	Teller cust = tellerService.getTellerToVerify(teller.getCustomerId(), teller.getCustomerId());
//    	if(cust != null) {
//    		return new ResponseEntity<>(new TellerResponse("000","teller to verify found",
//    				true,GlobalResponse.APIV,cust),HttpStatus.OK);
//    	} else {
//		return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"201",
//				false, "teller to verify not found"),HttpStatus.OK);
//    	 }
//        } catch (Exception e) {
//		    GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
//	     	e.printStackTrace();
//	    	return new ResponseEntity<>(resp, HttpStatus.OK);
//	  }
//    }

	@GetMapping(value = "/tellersToApprove")
	public ResponseEntity<?> getCustomersToApprove(@RequestParam(value = "branchCode") String branchCode,
			@RequestParam(value = "groupid") String groupid) {
		try {
			System.out.println("Branch Code: " + branchCode);
			System.out.println("Right ID: " + groupid);

			UserGroup userGroup = userGroupService.getRightCode(Long.valueOf(groupid));
			List<TellerToApprove> tellers;
			// Do not filter for sys admins and regional supervisor checkers
			if (userGroup.getGroupCode().equalsIgnoreCase("G003")
					|| userGroup.getGroupCode().equalsIgnoreCase("G004")) {
				tellers = tellerService.getTellersToVerifyAll();
			} else {
				tellers = tellerService.getTellersToVerify(branchCode);
			}

			if (tellers.size() > 0) {
				return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "000", false,
						"tellers to verify found", new HashSet<>(tellers)), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "201", false,
						"no tellers to verify found", new HashSet<>(tellers)), HttpStatus.OK);
			}
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@GetMapping(value = "/tellersToApproveDetach")
	public ResponseEntity<?> getTellersToApproveDetach() {
		try {
			List<TellersToApproveDetach> tellers = tellerService.getTellersToApproveDetach();
			if (tellers.size() > 0) {
				return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "000", true,
						"tellers to approve detach found", new HashSet<>(tellers)), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "201", false,
						"no tellers to approve detach found", new HashSet<>(tellers)), HttpStatus.OK);
			}
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "/approveTeller")
	public ResponseEntity<?> approveCustomer(@RequestBody Teller teller) {
        try {
//            String t24Url = env.getProperty("tserver") + teller.getCustomerId() + "/true";

            String t24Url = env.getProperty("tserver");
            String customerId = teller.getCustomerId();
            log.info("update url for " + t24Url);

//            String response = HttpRestProccesor.postJson(t24Url, customerId);
            String response = HttpRestProccesor.postApproveUser(t24Url, customerId);

            log.info("T24 response response " + response);
            if(response.equals("failed")){
                return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "HpptRestProcessor Failed", false, "no teller found"),
                        HttpStatus.OK);
            }
        } catch (Exception e) {
            log.error("upTellerDetails", e);
            return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "HpptRestProcessor Exception", false, "no teller found"),
                    HttpStatus.OK);
        }

		try {
			int cust = tellerService.approveTeller(teller.getVerifiedBy(), teller.getCustomerId());

			if (cust > 0) {
				//send email after approving the staff
				String recipient = teller.getTellerEmail();
				if(recipient == null) {
					log.info("Email for " + teller.getTellerName() + " is null");
				}else if(!recipient.contains("@")){
					// if the email does not contain the "@" sign, then it is likely that
					// the t24 endpoint returned a string of "email not available" or similar
					// denoting that the staff does not have an email address
					log.info("Email for " + teller.getTellerName() + " is not available");
				}else {
					String subject = "Biometric Details of Staff Captured";
					String emailContent = "Dear " + teller.getTellerName() + ", your biometric details have been successfully registered. For any queries please call 0711087000 or 0732187000.";
					emailSender.sendEmail(recipient, subject, emailContent);
					log.info("Email to staff scheduled to be sent to " + teller.getTellerName());
				}

				return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "000", true,
						"teller  " + teller.getCustomerId() + " verified successfully"), HttpStatus.OK);

			} else {
				return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "201", false, "no teller found"),
						HttpStatus.OK);
			}
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "/upgradeCustomerProfile")
	public ResponseEntity<?> upgradeCustomerProfile(@RequestBody Teller teller) {
		try {
			System.out.println("####" + teller.getTellerId());
			Teller cust = null;
			int tellerUndeleted = 0;
			if (tellerService.checkStaffDeleted(teller.getTellerId()) != null) {
				tellerUndeleted = tellerService.staffUnDelete(teller.getCreatedBy(), teller.getTellerId());
			} else {
				cust = tellerService.upTellerDetails(teller);
			}
			if (cust != null || tellerUndeleted > 0) {
				int prof = this.customerSvc.upgradeCustomerProfile(teller.getCustomerId());
				if (prof > 0) {
					int userStatusUpdate = userService.updateStatusToTrue(teller.getTellerSignOnName());
					if (userStatusUpdate > 0) {
						return new ResponseEntity<>(
								new GlobalResponse("000", "customer upgraded successfully", true, GlobalResponse.APIV),
								HttpStatus.OK);
					} else {
						return new ResponseEntity<>(
								new GlobalResponse("201", "failed to update user status", false, GlobalResponse.APIV),
								HttpStatus.OK);
					}
				} else {
					return new ResponseEntity<>(
							new GlobalResponse("201", "failed to upgrade customer details", false, GlobalResponse.APIV),
							HttpStatus.OK);
				}
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

	@PostMapping(value = "/rejectTellerApproval")
	public ResponseEntity<?> rejectTellerApproval(@RequestBody Teller teller) {
		try {
			int updates = tellerService.rejectTellerApproval(teller.getRejectedBy(), teller.getCustomerId());
			if (updates > 0) {
				return new ResponseEntity<>(
						new GlobalResponse("000", "Teller rejected successfully", true, GlobalResponse.APIV),
						HttpStatus.OK);
			} else {
				return new ResponseEntity<>(
						new GlobalResponse(GlobalResponse.APIV, "201", false, "Teller not successfully rejected"),
						HttpStatus.OK);
			}
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404",
					"An Exception occurred while attempting to reject the teller", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "/removeTeller")
	public ResponseEntity<?> removeTeller(@RequestBody Teller teller) {
		try {
			int updates = tellerService.removeTeller(teller.getDeletedBy(), teller.getCustomerId());
			if (updates > 0) {
				return new ResponseEntity<>(
						new GlobalResponse("000", "Teller removed successfully", true, GlobalResponse.APIV),
						HttpStatus.OK);
			} else {
				return new ResponseEntity<>(
						new GlobalResponse(GlobalResponse.APIV, "201", false, "Teller not removed successfully"),
						HttpStatus.OK);
			}
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404",
					"An Exception occurred while attempting to remove the teller", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "/obtainTellerDetails")
	public ResponseEntity<?> obtainTellerDetails(@RequestBody Teller teller) {
		try {
			System.out.println("teller id" + teller.getTellerId());
			Teller cust = tellerService.checkTeller(teller.getTellerId());
			if (cust != null) {
				return new ResponseEntity<>(new TellerResponse("000", "teller found", true, GlobalResponse.APIV, cust),
						HttpStatus.OK);
			} else {
				return new ResponseEntity<>(
						new GlobalResponse(GlobalResponse.APIV, "201", false, "teller not enrolled"), HttpStatus.OK);
			}
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "/approveRemoveTeller")
	public ResponseEntity<?> approveRemoveTeller(@RequestBody Teller teller) {
		try {
			int updates = tellerService.approveRemoveTeller(teller.getCustomerId());

			if (updates > 0) {
				return new ResponseEntity<>(new GlobalResponse("000",
						"removal of teller " + teller.getCustomerId() + " approved successfully", true,
						GlobalResponse.APIV), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(
						new GlobalResponse(GlobalResponse.APIV, "201", false,
								"removal of teller " + teller.getCustomerId() + " not approved successfully"),
						HttpStatus.OK);
			}
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping(value = "/rejectRemoveTeller")
	public ResponseEntity<?> rejectRemoveTeller(@RequestBody Teller teller) {
		try {
			int updates = tellerService.rejectRemoveTeller(teller.getCustomerId());

			if (updates > 0) {
				return new ResponseEntity<>(new GlobalResponse("000",
						"removal of teller " + teller.getCustomerId() + " rejected successfully", true,
						GlobalResponse.APIV), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(
						new GlobalResponse(GlobalResponse.APIV, "201", false,
								"removal of teller " + teller.getCustomerId() + " not rejected successfully"),
						HttpStatus.OK);
			}
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@GetMapping("/previewStaff")
	public ResponseEntity<?> previewStaff(@RequestParam("FromDt") @DateTimeFormat(pattern = "yyyy-MM-dd") Date fromDate,
			@RequestParam(value = "ToDt") @DateTimeFormat(pattern = "yyyy-MM-dd") Date toDate,
			@RequestParam(value = "enrolledType") String enrolledType, @RequestParam(value = "branchCode") String branchCode,
                                          @RequestParam(value = "groupid") String groupId) {
		try {
            List<Teller> staff;
            UserGroup userGroup = userGroupService.getRightCode(Long.valueOf(groupId));
            // the system administrators to be able to view all the reports
            if (userGroup.getGroupCode().equalsIgnoreCase("G003")
                    || userGroup.getGroupCode().equalsIgnoreCase("G004")) {
                staff = tellerService.getEnrolledStaff(fromDate, toDate, enrolledType);
            }else{
                // other system users to view reports based on their branches
                staff = tellerService.getEnrolledStaffByBranch(fromDate, toDate, enrolledType, branchCode);
            }
			if (staff.size() > 0) {
				return new ResponseEntity<>(
						new GlobalResponse(GlobalResponse.APIV, "000", true, "staff found", new HashSet<>(staff)),
						HttpStatus.OK);
			}
			return new ResponseEntity<>(
					new GlobalResponse(GlobalResponse.APIV, "000", false, "staff not found", new HashSet<>(staff)),
					HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404", "error processing staff details request", false,
					GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

}
