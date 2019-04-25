package com.compulynx.compas.controllers;

import java.util.HashSet;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.compulynx.compas.customs.Api;
import com.compulynx.compas.customs.responses.GlobalResponse;
import com.compulynx.compas.models.RightMaster;
import com.compulynx.compas.services.RightsMasterService;

@RestController
@RequestMapping(value = Api.REST)
public class RightsMasterController {
	@Autowired
	private RightsMasterService masterService;
	
	@GetMapping(value="/rightsmenulist")
	public ResponseEntity<?> getRights() {
		try {
		List<RightMaster> rights = masterService.getRights();
		
		if(rights.isEmpty()) {
			return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"404", 
					false, "no rights found",
					new HashSet<>(rights)), HttpStatus.OK);
			
			
		}
		return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"000", 
				false, "no rights found",
				new HashSet<>(rights)), HttpStatus.OK);
//		return new ResponseEntity<>(new CustomResponse(CustomResponse.APIV,
//				200, true, "rights found",new HashSet<>(rights)),HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}
}
