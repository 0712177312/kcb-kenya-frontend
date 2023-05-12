package com.compulynx.compas.controllers;

import java.util.HashSet;
import java.util.List;

import com.compulynx.compas.security.AESsecure;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
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
import com.compulynx.compas.models.Branch;
import com.compulynx.compas.models.Country;
import com.compulynx.compas.services.RegionService;

@RestController
@RequestMapping(value = Api.REST)
public class RegionController {
	@Autowired
	private RegionService regionService;

	@Autowired
	private AESsecure aeSsecure;

	Gson gson = new Gson();
	
	@GetMapping("/gtCountries")
	public ResponseEntity<?> getCountries () {

		String responsePayload="";

		try {
		List<Country> countries = regionService.getCountries();
		
		if(countries.size() < 0) {
			GlobalResponse globalResponse = new GlobalResponse(GlobalResponse.APIV,"201",
					false, "countries found",
					new HashSet<>(countries));

			responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());

			return new ResponseEntity<>(responsePayload,HttpStatus.OK);
		}
			GlobalResponse globalResponse = new GlobalResponse(GlobalResponse.APIV,"000",
					true, "countries found",
					new HashSet<>(countries));

			responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());

		return new ResponseEntity<>(responsePayload,HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
			e.printStackTrace();

			responsePayload = aeSsecure.encrypt(gson.toJson(resp).toString());

			return new ResponseEntity<>(responsePayload, HttpStatus.OK);
		}
	}
	
	@GetMapping("/gtActiveCountries")
	public ResponseEntity<?> getActiveCountries () {
		String responsePayload ="";
		try {
		List<Country> countries = regionService.getActiveCountries();
		
		if(countries.size() < 0) {
			GlobalResponse globalResponse = new GlobalResponse(GlobalResponse.APIV,"201",
					false, "countries found",
					new HashSet<>(countries));

			responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());
			return new ResponseEntity<>(responsePayload,HttpStatus.OK);
		}
			GlobalResponse globalResponse = new GlobalResponse(GlobalResponse.APIV,"000",
					true, "countries found",
					new HashSet<>(countries));
			responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());

		return new ResponseEntity<>(responsePayload,HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
			e.printStackTrace();

			responsePayload = aeSsecure.encrypt(gson.toJson(resp).toString());

			return new ResponseEntity<>(responsePayload, HttpStatus.OK);
		}
	}
	@GetMapping("/gtActiveCountryBranches")
	public ResponseEntity<?> getActiveCountryBranches (
			@RequestParam(value="ctry") String country) {

		String responsePayload="";

		try {
		List<Branch> branches = regionService.getActiveCountryBranches(country);
		   if(branches.size() < 0) {
			   GlobalResponse globalResponse = new GlobalResponse("201",
					   "no branches found",false,GlobalResponse.APIV,new HashSet<>(branches));

			   responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());
			  return new ResponseEntity<>(responsePayload,HttpStatus.OK);
		}
			GlobalResponse globalResponse = new GlobalResponse("000",
					"branches found",true,GlobalResponse.APIV,new HashSet<>(branches));
			responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());

		return new ResponseEntity<>(responsePayload,HttpStatus.OK);
		} catch (Exception e) {
			 GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
			   e.printStackTrace();

			responsePayload = aeSsecure.encrypt(gson.toJson(resp).toString());

			       return new ResponseEntity<>(responsePayload, HttpStatus.OK);
		}
	}
	@PostMapping("/upCountry")
	public ResponseEntity<?> upCountry(
			@RequestBody Country country) {
		try {
			Country cou = regionService.checkIfExists(country.getCountryCode(), country.getName());
			if(cou != null && country.getId() == 0) {
				 return new ResponseEntity<>(new GlobalResponse("201",
			 			"Specified country name or code already exist",false,GlobalResponse.APIV),HttpStatus.OK);
			} else {
			   Country count = regionService.upCountry(country);
			   if(count == null) {
				   return new ResponseEntity<>(new GlobalResponse("201",
			 			 "failed to update country details",false,GlobalResponse.APIV),HttpStatus.OK);
		    	}
			    return new ResponseEntity<>(new GlobalResponse("000",
					"Country details successfully updated",true,GlobalResponse.APIV),HttpStatus.OK);
			  }
	    	} catch (Exception e) {
			    GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
		     	e.printStackTrace();
		    	return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@GetMapping("/gtBranches")
	public ResponseEntity<?> getBranches()
	{
		String responsePayload = "";
		try {
		 List<Branch> branches = regionService.getBranches();
		   if(branches.size() < 0) {

			   GlobalResponse globalResponse = new GlobalResponse("201",
					   "no branches found",false,GlobalResponse.APIV,new HashSet<>(branches));
			   responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());
			  return new ResponseEntity<>(responsePayload,HttpStatus.OK);
		}
			GlobalResponse globalResponse = new GlobalResponse("000",
					"branches found",true,GlobalResponse.APIV,new HashSet<>(branches));
			responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());

		return new ResponseEntity<>(responsePayload,HttpStatus.OK);
		} catch (Exception e) {
			 GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
			   e.printStackTrace();

			responsePayload = aeSsecure.encrypt(gson.toJson(resp).toString());

			       return new ResponseEntity<>(responsePayload, HttpStatus.OK);
		}
	}
	
	@GetMapping("/gtActiveBranches")
	public ResponseEntity<?> getActiveBranches()
	{

		String responsePayload = "";

		try {
		 List<Branch> branches = regionService.getActiveBranches();
		   if(branches.size() < 0) {
			   GlobalResponse globalResponse = new GlobalResponse("201",
					   "no branches found",false,GlobalResponse.APIV,new HashSet<>(branches));

			   responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());
			  return new ResponseEntity<>(responsePayload,HttpStatus.OK);
		}
			GlobalResponse globalResponse = new GlobalResponse("000",
					"branches found",true,GlobalResponse.APIV,new HashSet<>(branches));
			responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());

		return new ResponseEntity<>(responsePayload,HttpStatus.OK);
		} catch (Exception e) {
			 GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
			   e.printStackTrace();

			responsePayload = aeSsecure.encrypt(gson.toJson(resp).toString());

			       return new ResponseEntity<>(responsePayload, HttpStatus.OK);
		}
	}
	
	@PostMapping("/upBranch")
	public ResponseEntity<?> upBranch( @RequestBody Branch branch)
	{
		try {
			Branch bran = regionService.checkIfBranchExist(branch.getBranchCode(),branch.getBranchName());
		 if( bran !=null && branch.getId() == 0) {
		       return new ResponseEntity<>(new GlobalResponse("201",
				    "branch with specified details already exists",false,GlobalResponse.APIV),HttpStatus.OK);
		  } else {
			Branch br = regionService.upBranch(branch);
			if(br !=null) {
			  return new ResponseEntity<>(new GlobalResponse("000",
					"branch details successfully updated",true,GlobalResponse.APIV),HttpStatus.OK);
	    	}
		       return new ResponseEntity<>(new GlobalResponse("201",
				    "failed to updated branch details",false,GlobalResponse.APIV),HttpStatus.OK);
			}
	     } catch (Exception e) {
		    	 GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
		    	   e.printStackTrace();
			       return new ResponseEntity<>(resp, HttpStatus.OK);
	  }
	}


    @GetMapping(value="/getBranchesToWaive")
    public ResponseEntity<?> getBranchToWaive( ) {

		String responsePayload="";

		try {
			 List<Branch> branches = regionService.getBranchesToWaive();
			   if(branches.size() < 0) {
				   GlobalResponse globalResponse = new GlobalResponse("201",
						   "no branches found",false,GlobalResponse.APIV,new HashSet<>(branches));

				   responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());

				  return new ResponseEntity<>(responsePayload,HttpStatus.OK);
			}
			GlobalResponse globalResponse = new GlobalResponse("000",
					"branches found",true,GlobalResponse.APIV,new HashSet<>(branches));

			responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());

			return new ResponseEntity<>(responsePayload,HttpStatus.OK);
			} catch (Exception e) {
				 GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
				   e.printStackTrace();

			responsePayload = aeSsecure.encrypt(gson.toJson(resp).toString());

				       return new ResponseEntity<>(responsePayload, HttpStatus.OK);
			}
    }
    
    @PostMapping(value="/approveBranchWaive")
    public ResponseEntity<?> approveWaivedCountry(@RequestBody Branch branch) {
    	try {
    	System.out.println("country code" + branch.getCountryCode());
    	int cust = regionService.approveBranchWaive(branch.getWaivedApprovedBy(), branch.getId());
    	if(cust > 0) {
    		return new ResponseEntity<>(new GlobalResponse(
    				"000","branch waive approved successfully",true,GlobalResponse.APIV),HttpStatus.OK);
    	} else {
		return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"201",
				false, "failed to update branch details"),HttpStatus.OK);
    	  }
        } catch (Exception e) {
		    GlobalResponse resp = new GlobalResponse("404","error processing country details request",false,GlobalResponse.APIV);
	     	e.printStackTrace();
	    	return new ResponseEntity<>(resp, HttpStatus.OK);
	  }
    }
    @PostMapping(value="/rejectBranchWaive")
    public ResponseEntity<?> rejectWaivedCountry(@RequestBody Branch branch) {
    	try {
    	System.out.println("country code" + branch.getCountryCode());
    	int cust = regionService.rejectBranchWaive(branch.getWaivedApprovedBy(), branch.getId());
    	if(cust > 0) {
    		return new ResponseEntity<>(new GlobalResponse(
    				"000","branch waive rejected successfully",true,GlobalResponse.APIV),HttpStatus.OK);
    	} else {
		return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"201",
				false, "failed to update branch waive"),HttpStatus.OK);
    	  }
        } catch (Exception e) {
		    GlobalResponse resp = new GlobalResponse("404","error processing country details request",false,GlobalResponse.APIV);
	     	e.printStackTrace();
	    	return new ResponseEntity<>(resp, HttpStatus.OK);
	  }
    }
    
    @GetMapping(value ="/gtWaivedBranches")
    public ResponseEntity<?> getWaivedBranches() {

		String responsePayload="";
      try {
    	List<Branch> brans = regionService.getWaivedBranches();
    	if(brans.size() > 0) {
			GlobalResponse globalResponse =new GlobalResponse(GlobalResponse.APIV,"000",
					true, "waived branches found",
					new HashSet<>(brans));
			responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());
    		return new ResponseEntity<>(responsePayload,HttpStatus.OK);
    	}
		  GlobalResponse globalResponse = new GlobalResponse(GlobalResponse.APIV,"201",
				  false, "no waived branches found",
				  new HashSet<>(brans));
		  responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());

		return new ResponseEntity<>(responsePayload,HttpStatus.OK);
	  	} catch (Exception e) {
		    GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
	     	e.printStackTrace();

		  responsePayload = aeSsecure.encrypt(gson.toJson(resp).toString());

	    	return new ResponseEntity<>(responsePayload, HttpStatus.OK);
	    }
    }
    
    @PostMapping(value="/waiveBranch")
    public ResponseEntity<?> waiveBranch(@RequestBody Branch branch) {
    	try {
    	int cust = regionService.waiveBranch(branch.getWaivedBy(), branch.getId());
    	if(cust > 0) {
    		return new ResponseEntity<>(new GlobalResponse("000","branch details updated successfully ",
    				true,GlobalResponse.APIV),HttpStatus.OK);
    	} else {
		return new ResponseEntity<>(new GlobalResponse("201","failed to update branch details",
				false,GlobalResponse.APIV),HttpStatus.OK);
    	  }
        } catch (Exception e) {
		    GlobalResponse resp = new GlobalResponse("404","error processing country details request",false,GlobalResponse.APIV);
	     	e.printStackTrace();
	    	return new ResponseEntity<>(resp, HttpStatus.OK);
	  }
    }    
    

    @GetMapping(value="/gtCountriesToWaive")
	public ResponseEntity<?> getCountriesToWaive () {

		String responsePayload="";

		try {
		List<Country> countries = regionService.getCountriesToWaive();
		
		if(countries.size() < 0) {
			GlobalResponse globalResponse = new GlobalResponse(GlobalResponse.APIV,"201",
					false, "countries found",
					new HashSet<>(countries));

			responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());
			return new ResponseEntity<>(responsePayload,HttpStatus.OK);
		}
			GlobalResponse globalResponse = new GlobalResponse(GlobalResponse.APIV,"000",
					true, "countries found",
					new HashSet<>(countries));
			responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());

		return new ResponseEntity<>(responsePayload,HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
			e.printStackTrace();

			responsePayload = aeSsecure.encrypt(gson.toJson(resp).toString());

			return new ResponseEntity<>(responsePayload, HttpStatus.OK);
		}
	}
    
    @PostMapping(value="/approveCountryWaive")
    public ResponseEntity<?> approveWaivedCountry(@RequestBody Country country) {
    	try {
    	System.out.println("country code" + country.getCountryCode());
    	int cust = regionService.approveCountryWaive(country.getWaivedApprovedBy(), country.getId());
    	if(cust > 0) {
    		return new ResponseEntity<>(new GlobalResponse(
    				"000","country waived successfully",true,GlobalResponse.APIV),HttpStatus.OK);
    	} else {
		return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"201",
				false, "failed to update country details"),HttpStatus.OK);
    	  }
        } catch (Exception e) {
		    GlobalResponse resp = new GlobalResponse("404","error processing country details request",false,GlobalResponse.APIV);
	     	e.printStackTrace();
	    	return new ResponseEntity<>(resp, HttpStatus.OK);
	  }
    }
    @PostMapping(value="/rejectCountryWaive")
    public ResponseEntity<?> rejectWaivedCountry(@RequestBody Country country) {
    	try {
    	System.out.println("country code" + country.getCountryCode());
    	int cust = regionService.rejectCountryWaive(country.getWaivedApprovedBy(), country.getId());
    	if(cust > 0) {
    		return new ResponseEntity<>(new GlobalResponse(
    				"000","country details updated successfully",true,GlobalResponse.APIV),HttpStatus.OK);
    	} else {
		return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"201",
				false, "failed to update country details"),HttpStatus.OK);
    	  }
        } catch (Exception e) {
		    GlobalResponse resp = new GlobalResponse("404","error processing country details request",false,GlobalResponse.APIV);
	     	e.printStackTrace();
	    	return new ResponseEntity<>(resp, HttpStatus.OK);
	  }
    }
    
    @PostMapping(value="/waiveCountry")
    public ResponseEntity<?> waiveCountry(@RequestBody Country country) {
    	try {
    	System.out.println("country code" + country.getCountryCode());
    	int cust = regionService.waiveCountry(country.getWaivedBy(), country.getId());
    	if(cust > 0) {
    		return new ResponseEntity<>(new GlobalResponse(
    				"000","Country waived successfully",true,GlobalResponse.APIV),HttpStatus.OK);
    	} else {
		return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"201",
				false, "failed to update country details"),HttpStatus.OK);
    	  }
        } catch (Exception e) {
		    GlobalResponse resp = new GlobalResponse("404","error processing country details request",false,GlobalResponse.APIV);
	     	e.printStackTrace();
	    	return new ResponseEntity<>(resp, HttpStatus.OK);
	  }
    }
    
    @GetMapping(value ="/gtWaivedCountries")
    public ResponseEntity<?> getWaivedCountries() {

		String responsePayload="";

      try {
    	List<Country> brans = regionService.getWaivedCountries();
    	if(brans.size() > 0) {
			GlobalResponse globalResponse = new GlobalResponse(GlobalResponse.APIV,"000",
					true, "waived branches found",
					new HashSet<>(brans));

			responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());

    		return new ResponseEntity<>(responsePayload,HttpStatus.OK);
    	}
		  GlobalResponse globalResponse = new GlobalResponse(GlobalResponse.APIV,"201",
				  false, "no waived branches found",
				  new HashSet<>(brans));

		  responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());

		return new ResponseEntity<>(responsePayload,HttpStatus.OK);
	  	} catch (Exception e) {
		    GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
	     	e.printStackTrace();

		  responsePayload = aeSsecure.encrypt(gson.toJson(resp).toString());

	    	return new ResponseEntity<>(responsePayload, HttpStatus.OK);
	    }
    }
    
    @GetMapping(value ="/gtBranchesPrev")
    public ResponseEntity<?> getBranchesPrev(
    		@RequestParam("status")
    		String status) {
		String responsePayload = "";
      try {
    	if(status.equalsIgnoreCase("A")) {
    		List<Branch> brans = regionService.getBranches();
    		if ( brans.size() > 0) {
				GlobalResponse globalResponse = new GlobalResponse(GlobalResponse.APIV,"000",
						true, "waived branches found",
						new HashSet<>(brans));

				responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());

        		return new ResponseEntity<>(responsePayload,HttpStatus.OK);
        	}
			GlobalResponse globalResponse = new GlobalResponse(GlobalResponse.APIV,"201",
					false, "no branches found",
					new HashSet<>(brans));

			responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());

    		return new ResponseEntity<>(responsePayload,HttpStatus.OK);
    	}else {
    		List<Branch> brans = regionService.getBranchesPrev(status);
    		if ( brans.size() > 0) {

				GlobalResponse globalResponse = new GlobalResponse(GlobalResponse.APIV,"000",
						true, "waived branches found",
						new HashSet<>(brans));
				responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());
        		return new ResponseEntity<>(responsePayload,HttpStatus.OK);
        	}
			GlobalResponse globalResponse = new GlobalResponse(GlobalResponse.APIV,"201",
					false, "no waived branches found",
					new HashSet<>(brans));
			responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());

    		return new ResponseEntity<>(responsePayload,HttpStatus.OK);
    	}
	  	} catch (Exception e) {
		    GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
	     	e.printStackTrace();

		  responsePayload = aeSsecure.encrypt(gson.toJson(resp).toString());

	    	return new ResponseEntity<>(responsePayload, HttpStatus.OK);
	    }
    }
}