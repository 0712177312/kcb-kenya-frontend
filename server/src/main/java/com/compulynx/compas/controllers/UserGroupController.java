package com.compulynx.compas.controllers;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.compulynx.compas.customs.Api;
import com.compulynx.compas.customs.responses.GlobalResponse;
import com.compulynx.compas.models.UserGroup;
import com.compulynx.compas.models.extras.UserGroupImpl;
import com.compulynx.compas.models.extras.UserGroupRights;
import com.compulynx.compas.services.UserGroupService;

@RestController
@RequestMapping(value = Api.REST)
public class UserGroupController {
	
	@Autowired
	private UserGroupService userGroupService;
	
	@GetMapping("/usergroups")
	public ResponseEntity<?> getUserGroups() {
		try {
		List<UserGroup> userGroups =userGroupService.userGroups();
		
		if(userGroups.isEmpty()) {
			return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"404", 
					false, "cannot find usergroups",
					new HashSet<>(userGroups)),HttpStatus.NOT_FOUND );
		}
		
		return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"000", true, "usergroups",
				new HashSet<>(userGroups)),HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}
	@GetMapping("/usergroups/gtRights")
	public ResponseEntity<?> getUserGroupRights() {
		try {
		List<UserGroupRights> userGroups =userGroupService.getUserGroupRights();
		
		if(userGroups.isEmpty()) {
			return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"404", 
					false, "cannot find usergroups",
					new HashSet<>(userGroups)),HttpStatus.NOT_FOUND );
		}
		
		return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"000", true, "usergroups",
				new HashSet<>(userGroups)),HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}
	
	@GetMapping("/usergroups/gtUserGroups")
	public ResponseEntity<?> getUserGroup() {
		try {
		List<UserGroup> groups = userGroupService.userGroups();
		List<UserGroupImpl> rts = new ArrayList<UserGroupImpl>();
		if(groups.isEmpty()) {
			return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"404", 
					false, "cannot find usergroups",
					new HashSet<>(rts)),HttpStatus.NOT_FOUND );
		}
		for (UserGroup group: groups) {
			UserGroupImpl obj = new UserGroupImpl();
			obj.setId(group.getId());
			obj.setActive(group.isActive());
			obj.setCreatedBy(group.getCreatedBy());
			obj.setGroupCode(group.getGroupCode());
			obj.setGroupName(group.getGroupName());
			List<UserGroupRights> rights=userGroupService.getGroupRights(group.getId(),group.getId(),group.getId());
			obj.setRights(rights);
			rts.add(obj);
		}
		return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"000", true, "usergroups",
				new HashSet<>(rts)),HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@GetMapping("/usergroups/getUserGroupUsingGroupId")
	public ResponseEntity<?> getUserGroupUsingGroupId(@RequestParam(value="groupId") Long groupId) {
		try {
			UserGroup group = userGroupService.getRightCode(groupId);
			List<UserGroupImpl> rts = new ArrayList<UserGroupImpl>();
			if(group == null) {
				return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"404",
						false, "cannot find usergroup",
						new HashSet<>(rts)),HttpStatus.NOT_FOUND );
			}
			UserGroupImpl obj = new UserGroupImpl();
			obj.setId(group.getId());
			obj.setActive(group.isActive());
			obj.setCreatedBy(group.getCreatedBy());
			obj.setGroupCode(group.getGroupCode());
			obj.setGroupName(group.getGroupName());
			List<UserGroupRights> rights=userGroupService.getGroupRights(group.getId(),group.getId(),group.getId());
			obj.setRights(rights);
			rts.add(obj);

			return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV,"000", true, "usergroup",
					new HashSet<>(rts)),HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}
	
	@GetMapping("/usergroups/usergroup")
	public ResponseEntity<?> userGroup(
			@RequestParam(value="id") Long id) {
		try {
			Optional<UserGroup> group = userGroupService.getUserGroup(id);
			if(group ==null) {
				return new ResponseEntity<>(new GlobalResponse("404","does not exist",false,GlobalResponse.APIV,group
						),HttpStatus.OK);
			}
			
			return new ResponseEntity<>(new GlobalResponse("000","does not exist",true,GlobalResponse.APIV,group
					),HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
		
	}
	
	@PostMapping("/usergroups/assignrights")
	public ResponseEntity<?> addUserGroup(
			@RequestBody UserGroup userGroup) {
	  try {
		//if(userGroup.getId() == 0 && userGroup.getRights().size() > 0)  {
//			UserGroup usrg = new UserGroup(userGroup.getGroupCode(), userGroup.getGroupName(), 
//					0, userGroup.isActive(), userGroup.getCreatedBy());
//			usrepositories.save(usrg);
//			for(UserAssignedRights uar: userGroup.getRights()) {
//				UserAssignedRights uasr = new
//						UserAssignedRights(uar.isAllowView(), uar.isAllowAdd(), 
//								uar.isAllowEdit(), uar.isAllowDelete(), uar.getCreatedBy(), uar.getRightId(), uar.getGroupId());
//				userAssignedRightsRepository.save(uasr);
//			}
		    UserGroup ust = userGroupService.addGroup(userGroup);
			
	    	if(ust ==null) {
			  return new ResponseEntity<>(new GlobalResponse("203","failed to save user groups",
					false,GlobalResponse.APIV),HttpStatus.OK);
	    	} else {
		
		      return new ResponseEntity<>(new GlobalResponse("000","user group updated successfully",
				    true,GlobalResponse.APIV),HttpStatus.OK);
	    	
		///}else {
//			  userAssignedRightsService.removeAssignedRights(userGroup.getId());
//			  return null;
	      }
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}
}
