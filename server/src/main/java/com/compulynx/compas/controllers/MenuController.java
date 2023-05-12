package com.compulynx.compas.controllers;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;

import com.compulynx.compas.security.AESsecure;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.compulynx.compas.customs.Api;
import com.compulynx.compas.customs.responses.GlobalResponse;
import com.compulynx.compas.models.MenuHeaderMaster;
import com.compulynx.compas.services.MenuService;

@RestController
@RequestMapping(value=Api.REST)
public class MenuController {
	@Autowired
	private MenuService headerService;

	@Autowired
	private AESsecure aeSsecure;
	Gson gson = new Gson();
	
	@GetMapping("/menulist")
	public ResponseEntity<?> getHeaderMenus() {
		String responsePayload="";

		try {
		Collection<MenuHeaderMaster> menus = headerService.getMenuHeaders();
		
		if(menus.isEmpty()) {

			GlobalResponse globalResponse = new GlobalResponse(GlobalResponse.APIV,"404",
					false, "no menu list  found",
					new HashSet<>(menus));
			responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());

			return new ResponseEntity<>(responsePayload, HttpStatus.NOT_FOUND);
		}
			GlobalResponse globalResponse = new GlobalResponse(GlobalResponse.APIV,"000",
					true, "menus found",
					new HashSet<>(menus));

			responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());

		return new ResponseEntity<>(responsePayload,HttpStatus.OK);
    	  } catch (Exception e) {
		        GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
	          e.printStackTrace();

			responsePayload = aeSsecure.encrypt(gson.toJson(resp).toString());

	       return new ResponseEntity<>(responsePayload, HttpStatus.OK);
	    }
	}
	
	@GetMapping("/menulist/group")
	public ResponseEntity<?> getGroupMenus(
			@RequestParam(value="groupId") Long groupId) {

		String responsePayload="";

	 try {
		List<MenuHeaderMaster> menus =headerService.getGroupMenus(groupId);
		
		if(menus.isEmpty()) {
			GlobalResponse globalResponse = new GlobalResponse(GlobalResponse.APIV,"404",
					false, "no rights found",
					new HashSet<>(menus));

			responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());
			 return new ResponseEntity<>(responsePayload, HttpStatus.OK);
		  }
		 GlobalResponse globalResponse = new GlobalResponse(GlobalResponse.APIV,"000",
				 true, "rights found",
				 new HashSet<>(menus));
		 responsePayload = aeSsecure.encrypt(gson.toJson(globalResponse).toString());

		return new ResponseEntity<>(responsePayload,HttpStatus.OK);
    	} catch (Exception e) {
		    GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
	     	e.printStackTrace();

		 responsePayload = aeSsecure.encrypt(gson.toJson(resp).toString());

	    	return new ResponseEntity<>(responsePayload, HttpStatus.OK);
	    }
	}
		
}
