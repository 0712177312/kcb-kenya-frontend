package com.compulynx.compas.controllers;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;

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
	
	@GetMapping("/menulist")
	public ResponseEntity<?> getHeaderMenus() {
		try {
		Collection<MenuHeaderMaster> menus = headerService.getMenuHeaders();
		
		if(menus.isEmpty()) {
			return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"404", 
					false, "no menu list  found",
					new HashSet<>(menus)), HttpStatus.NOT_FOUND);
		}
		
		return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"000",
				true, "menus found",
				new HashSet<>(menus)),HttpStatus.OK);
    	  } catch (Exception e) {
		        GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
	          e.printStackTrace();
	       return new ResponseEntity<>(resp, HttpStatus.OK);
	    }
	}
	
	@GetMapping("/menulist/group")
	public ResponseEntity<?> getGroupMenus(
			@RequestParam(value="groupId") Long groupId) {
	 try {
		List<MenuHeaderMaster> menus =headerService.getGroupMenus(groupId);
		
		if(menus.isEmpty()) {
			 return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"404", 
			 		false, "no rights found",
				 	new HashSet<>(menus)), HttpStatus.OK);
		  }
		
		return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"000",
				true, "rights found",
				new HashSet<>(menus)),HttpStatus.OK);
    	} catch (Exception e) {
		    GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
	     	e.printStackTrace();
	    	return new ResponseEntity<>(resp, HttpStatus.OK);
	    }
	}
		
}
