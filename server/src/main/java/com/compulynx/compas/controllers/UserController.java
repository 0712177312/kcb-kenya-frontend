package com.compulynx.compas.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import com.compulynx.compas.customs.Api;
import com.compulynx.compas.customs.SendMail;
import com.compulynx.compas.customs.responses.GlobalResponse;
import com.compulynx.compas.customs.responses.UserResponse;
import com.compulynx.compas.models.User;
import com.compulynx.compas.models.extras.UsersToVerify;
import com.compulynx.compas.security.AES;
import com.compulynx.compas.services.UserService;

@RestController
@RequestMapping(value = Api.REST )
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@GetMapping("/allUsers")
	public ResponseEntity<?> getUsers() throws Exception {
		try {
		List<User> users = userService.getUsers();
		
		System.out.println("System users ####");
		
//		for(User usr: users) {
//
//			usr.setPassword(AES.decrypt(usr.getPassword()));
//		}
		
		if(users.isEmpty()) {
			return new ResponseEntity<>(new UserResponse(users,"no users found",false,"000",Api.API_VERSION), HttpStatus.OK);
		}
		
		    return new ResponseEntity<>(new UserResponse(users,"users found",true,"000",Api.API_VERSION), HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}

	@PostMapping("/editUserProfile")
	public ResponseEntity<?> editUserProfile(@RequestBody User user) throws Exception {
		try {
			System.out.println(user);
			System.out.println(user.getFullName()+ user.getEmail()+ user.getPhone()+ user.getGroup()+
					user.getBranch()+ user.getId());
			int userUpdate = userService.updateUsers(user.getGroup(), user.isStatus(), user.getId());
			if (userUpdate > 0) {
				return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "000", true, "User updated successfully"),
						HttpStatus.OK);
			} else {
				return new ResponseEntity<>(new GlobalResponse(GlobalResponse.APIV, "201",
						false, "user not updated successfully"), HttpStatus.OK);
			}
		}catch (Exception e){
			GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}
	
	@PostMapping("/upUser")
	public ResponseEntity<?> addUser(@RequestBody User user) throws Exception {
		try {
			String pass =randomPassword();
			System.out.println("pss##" + pass);
		User username = userService.findByUsername(user.getUsername());
		
		if(username !=null && user.getId() == 0) {
			return new ResponseEntity<>(new UserResponse(user,"user with same username already exist",
					false,"201",Api.API_VERSION), HttpStatus.OK);
		}
		System.out.println("username" + user.getPassword());
		if(user.getPassword()!=null){
			user.setPassword(AES.encrypt(user.getPassword()));
		}else{
			user.setPassword("");
		}

		User usr=userService.addUser(user);
		
		if(usr ==null) {
			return new ResponseEntity<>(new UserResponse(user,"failed to add user",
					false,"201",Api.API_VERSION), HttpStatus.OK);				
		}
//		try {
////			SendMail mail = new SendMail();
////			mail.sendEmail(user.getEmail(), user.getFullName(), pass );
//		} catch(Exception e) {
//			e.printStackTrace();
//		}
		
		return new ResponseEntity<>(new UserResponse(user,"user updated successfully",
				true,"000",Api.API_VERSION), HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}
	
	@PostMapping(value="/sysusers/auth")
	public ResponseEntity<?> authUser(@RequestBody User user) throws Exception {
		try {
		User userpro=userService.authUser(user);
		System.out.println(userpro);
		if(userpro == null) {
			return new ResponseEntity<>(new UserResponse("invalid or unknown user credentials, kindly verify to continue",
					false,"201",Api.API_VERSION), HttpStatus.OK);
		}
//		else if(!userpro.getApproved().equalsIgnoreCase("V") || userpro.isStatus() == false  ) {
//			return new ResponseEntity<>(new UserResponse("user specified is neither verified or active, kindly ensure  you verified and actived ",
//					false,"201",Api.API_VERSION), HttpStatus.OK);
//		}
		else if(userpro != null && userpro.isStatus() != false) {
			System.out.println("email"+user.getEmail());
			return new ResponseEntity<>(new UserResponse(userpro,"successfully authenticated!",
					true,"000",Api.API_VERSION), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(new UserResponse("successfully authenticated!",
					false,"201",Api.API_VERSION), HttpStatus.OK);
	   }
     } catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404","Server failure authenticating user",false,GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}
		
	@SuppressWarnings("unused")
	@PostMapping(value="/sysusers/print/auth")
	public ResponseEntity<?> printAuthUser(@RequestBody User user) throws Exception {
		try {
		User userpro=userService.findByUsername(user.getUsername());
		System.out.println(userpro);
		if(userpro == null) {
			return new ResponseEntity<>(new UserResponse("failed to add user",
			           false,"409",Api.API_VERSION), HttpStatus.OK);
		}
		else if(!userpro.getApproved().equalsIgnoreCase("V") || userpro.isStatus() == false  ) {
			return new ResponseEntity<>(new UserResponse("user specified is neither verified or active, kindly ensure you verified and active ",
			           false,"201",Api.API_VERSION), HttpStatus.OK);
		}
		else if(userpro != null) {
			System.out.println("email"+user.getEmail());
			return new ResponseEntity<>(new UserResponse(userpro,"successfully authenticated!",
			           true,"000",Api.API_VERSION), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(new UserResponse("invalid user credentials",
			           false,"409",Api.API_VERSION), HttpStatus.OK);
		}
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
	}
	
    @GetMapping(value="/users/toverify")
    public ResponseEntity<?> getUsersToVerify(
//    		@RequestParam("fromDt")
//    		@DateTimeFormat(pattern="yyyy-MM-dd")
//    		Date fromDt,
//    		@RequestParam(value="toDt")
//    		@DateTimeFormat(pattern="yyyy-MM-dd")
//    		Date toDt
    		) {
    	try {
    	System.out.println("works...");
     	List<UsersToVerify> users = userService.getUsersToVerify();
     	if(users.isEmpty()) {
    		return new ResponseEntity<>(new UserResponse("no found users to approve ",
 		           false,"201",Api.API_VERSION,users), HttpStatus.OK);
     	}
		return new ResponseEntity<>(new UserResponse("found users to approve ",
		           true,"000",Api.API_VERSION,users), HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
    }
    
    @PostMapping(value="/users/verifyusers")
    public ResponseEntity<?> verifyUsers (
    		@RequestBody List<User> users) {
    	try {
    	  if(users.size() > 0) {  		
	    	for(User user: users) {
	    		System.out.println("user id ##" + user.getId());
	        	int upuser =userService.verifyUsers(user.getId());
	        	if(upuser < 0) {
	    			return new ResponseEntity<>(new UserResponse("there was problem approving users, kindly retry ",
	 			           false,"201",Api.API_VERSION), HttpStatus.OK);
	        	}
	    	}
			return new ResponseEntity<>(new UserResponse("user's approved successfully ",
			           true,"000",Api.API_VERSION), HttpStatus.OK);
    	}
		return new ResponseEntity<>(new UserResponse("There was problem updating users, kindly retry ",
		           false,"201",Api.API_VERSION), HttpStatus.OK);
		} catch (Exception e) {
			GlobalResponse resp = new GlobalResponse("404","error processing request",false,GlobalResponse.APIV);
			e.printStackTrace();
			return new ResponseEntity<>(resp, HttpStatus.OK);
		}
    }
    public String randomPassword(){
		System.out.println("Generating Password");
		
		String ALPHA_NUMERIC_STRING = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&?{}*";
		StringBuilder builder = new StringBuilder();
		
		int count =8;
		
		while (count-- != 0) {
			int character = (int)(Math.random()*ALPHA_NUMERIC_STRING.length());
			builder.append(ALPHA_NUMERIC_STRING.charAt(character));
		}
		return builder.toString();
		
		
	}

}
