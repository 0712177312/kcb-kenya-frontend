package com.compulynx.compas.controllers;

import java.util.List;
import java.util.UUID;

import com.compulynx.compas.models.UserGroup;
import com.compulynx.compas.security.AESsecure;
import com.compulynx.compas.services.UserGroupService;
import com.google.gson.Gson;
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

import javax.servlet.http.HttpSession;


@RestController
@RequestMapping(value = Api.REST)
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserGroupService userGroupService;
    @Autowired
    private AESsecure aeSsecure;

    Gson gson = new Gson();

    @GetMapping("/allUsers")
    public ResponseEntity<?> getUsers() throws Exception {
        try {
            List<User> users = userService.getUsers();

            System.out.println("System users ####");

//		for(User usr: users) {
//
//			usr.setPassword(AES.decrypt(usr.getPassword()));
//		}

            if (users.isEmpty()) {
                return new ResponseEntity<>(new UserResponse(users, "no users found", false, "000", Api.API_VERSION), HttpStatus.OK);
            }

            return new ResponseEntity<>(new UserResponse(users, "users found", true, "000", Api.API_VERSION), HttpStatus.OK);
        } catch (Exception e) {
            GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
            e.printStackTrace();
            return new ResponseEntity<>(resp, HttpStatus.OK);
        }
    }

    @GetMapping("/allUsersByBranchExcludingCurrentUser")
    public ResponseEntity<?> getAllUsersByBranchExcludingCurrentUser(
            @RequestParam(value = "branchCode") String branchCode,
            @RequestParam(value = "groupid") String groupId,
            @RequestParam(value = "userId") Long userId) throws Exception {
        String response = "";
        try {
            List<User> users;
            UserGroup userGroup = userGroupService.getRightCode(Long.valueOf(groupId));
            // Users of groups of Profile Management and User Management to be able to view all the users
            if (userGroup.getGroupCode().equalsIgnoreCase("G001")
                    || userGroup.getGroupCode().equalsIgnoreCase("G002")) {
                users = userService.getUsers();
            } else {
                users = userService.getAllUsersByBranchExcludingCurrentUser(branchCode, userId);
            }
            if (users.isEmpty()) {
                response = aeSsecure.encrypt(gson.toJson(new UserResponse(users, "no users found", false, "000", Api.API_VERSION)));
            } else {
                response = aeSsecure.encrypt(gson.toJson(new UserResponse(users, "users found", true, "000", Api.API_VERSION)));
            }
        } catch (Exception e) {
            GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
            e.printStackTrace();
            response = aeSsecure.encrypt(gson.toJson(resp));
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/editUserProfile")
    public ResponseEntity<?> editUserProfile(@RequestBody User user) throws Exception {
        try {
            System.out.println(user);
            System.out.println(user.getFullName() + user.getEmail() + user.getPhone() + user.getGroup() +
                    user.getBranch() + user.getId());
            int userUpdate = 0;
            // user checked the button to unlock the particular user
            if(user.isLocked()){
                userUpdate = userService.updateUsersAndUnlock(user.getGroup(), user.isStatus(), user.getId());
            }else {
                userUpdate = userService.updateUsers(user.getGroup(), user.isStatus(), user.getId());
            }
            if (userUpdate > 0) {
                return new ResponseEntity<>(aeSsecure.encrypt(gson.toJson(new GlobalResponse(GlobalResponse.APIV, "000", true, "User updated successfully"))),
                        HttpStatus.OK);
            } else {
                return new ResponseEntity<>(aeSsecure.encrypt(gson.toJson(new GlobalResponse(GlobalResponse.APIV, "201",
                        false, "user not updated successfully"))), HttpStatus.OK);
            }
        } catch (Exception e) {
            GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
            e.printStackTrace();
            return new ResponseEntity<>(aeSsecure.encrypt(gson.toJson(resp)), HttpStatus.OK);
        }
    }

    @PostMapping("/upUser")
    public ResponseEntity<?> addUser(@RequestBody User user) throws Exception {
        try {
            String pass = randomPassword();
            System.out.println("pss##" + pass);
            User username = userService.findByUsername(user.getUsername());

            if (username != null && user.getId() == 0) {

                return new ResponseEntity<>(aeSsecure.encrypt(gson.toJson(new UserResponse(user, "user with same username already exist", false, "201", Api.API_VERSION))), HttpStatus.OK);
            }
            System.out.println("username" + user.getPassword());
            if (user.getPassword() != null) {
                user.setPassword(AES.encrypt(user.getPassword()));
            } else {
                user.setPassword("");
            }

            User usr = userService.addUser(user);

            if (usr == null) {

                return new ResponseEntity<>(aeSsecure.encrypt(gson.toJson(new UserResponse(user, "failed to add user", false, "201", Api.API_VERSION))), HttpStatus.OK);
            }
//		try {
////			SendMail mail = new SendMail();
////			mail.sendEmail(user.getEmail(), user.getFullName(), pass );
//		} catch(Exception e) {
//			e.printStackTrace();
//		}

            return new ResponseEntity<>(aeSsecure.encrypt(gson.toJson(new UserResponse(user, "user updated successfully", true, "000", Api.API_VERSION))), HttpStatus.OK);
        } catch (Exception e) {
            GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
            e.printStackTrace();
            return new ResponseEntity<>(aeSsecure.encrypt(gson.toJson(resp)), HttpStatus.OK);
        }
    }

    @PostMapping(value = "/sysusers/auth")
    public ResponseEntity<?> authUser(@RequestBody User user, HttpSession httpSession) throws Exception {
        String response = "";
        UserResponse userresponse;
        User userpro=null;
        User usertrials=null;

        System.out.println("Got here");
        try {
            userpro= userService.authUser(user);
            System.out.println(userpro);
            if (userpro == null) {
                userresponse=new UserResponse("invalid or unknown user credentials, kindly verify to continue",
                        false, "201", Api.API_VERSION);
                User currentuser=userService.findByUsername(user.getUsername());
                if(currentuser!=null) {
                    userService.updateUsertrials(user.getUsername());
                    usertrials = userService.findByUsername(user.getUsername());
                    if (usertrials.getTrials() >= 3) {
                        userService.updateUserlocked(user.getUsername());
                        userresponse = new UserResponse("Account has been locked",
                                false, "201", Api.API_VERSION);
                    }
                }
            }

//		else if(!userpro.getApproved().equalsIgnoreCase("V") || userpro.isStatus() == false  ) {
//			return new ResponseEntity<>(new UserResponse("user specified is neither verified or active, kindly ensure  you verified and actived ",
//					false,"201",Api.API_VERSION), HttpStatus.OK);
//		}
            else if(userpro.isLocked()){
                userresponse=new UserResponse("Account has been locked.",
                        false, "201", Api.API_VERSION);
            }
            else if (userpro != null && userpro.isStatus() != false) {
                System.out.println("email" + user.getEmail());
                //CREATE UUID FOR GROUP REFERENCE
                UUID uuid = UUID. randomUUID();
                httpSession.setAttribute("test",userpro.getGroup());
                System.out.println("<><><><><><><><><><><><><>UUID "+ uuid);

                userresponse = new UserResponse(userpro,"successfully authenticated!",
                        true, "000", Api.API_VERSION);
            } else {
                userresponse =new UserResponse("successfully authenticated!",
                        false, "201", Api.API_VERSION);
            }
        } catch (Exception e) {
            userresponse =new UserResponse("An error occurred!",
                    false, "404", Api.API_VERSION);
            e.printStackTrace();
        }
        return new ResponseEntity<>(aeSsecure.encrypt(gson.toJson(userresponse)), HttpStatus.OK);
    }

    @SuppressWarnings("unused")
    @PostMapping(value = "/sysusers/print/auth")
    public ResponseEntity<?> printAuthUser(@RequestBody User user) throws Exception {
        String responsePayload ="";
        try {
        	System.out.println("/sysusers/print/auth looooooooooooooooooooging");
            User userpro = userService.findByUsername(user.getUsername());
            System.out.println(userpro);
            if (userpro == null) {
            	System.out.println("/sysusers/print/auth repo is nuuuuuuuuuuuuuuuuuuuuuuuuuuuull");
                return new ResponseEntity<>(new UserResponse("failed to add user",
                        false, "409", Api.API_VERSION), HttpStatus.OK);
            } else if (!userpro.getApproved().equalsIgnoreCase("V") || userpro.isStatus() == false) {
                return new ResponseEntity<>(new UserResponse("user specified is neither verified or active, kindly ensure you verified and active ",
                        false, "201", Api.API_VERSION), HttpStatus.OK);
            } else if (userpro != null) { 
                System.out.println("/sysusers/print/auth +++++++++++++++++++++++++++++ " + user.toString());
                UserResponse userResponse = new UserResponse(userpro, "successfully authenticated!", true, "000", Api.API_VERSION);
                responsePayload = aeSsecure.encrypt(gson.toJson(userResponse).toString());
                return new ResponseEntity<>(responsePayload, HttpStatus.OK);
            } else {
                UserResponse userResponse = new UserResponse("invalid user credentials", false, "409", Api.API_VERSION);
                responsePayload = aeSsecure.encrypt(gson.toJson(userResponse).toString());
                return new ResponseEntity<>(responsePayload, HttpStatus.OK);
            }
        } catch (Exception e) {
            GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
            e.printStackTrace();
            responsePayload = aeSsecure.encrypt(gson.toJson(resp).toString());
            return new ResponseEntity<>(responsePayload, HttpStatus.OK);
        }
    }

    @GetMapping(value = "/users/toverify")
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
            if (users.isEmpty()) {
                return new ResponseEntity<>(new UserResponse("no found users to approve ",
                        false, "201", Api.API_VERSION, users), HttpStatus.OK);
            }
            return new ResponseEntity<>(new UserResponse("found users to approve ",
                    true, "000", Api.API_VERSION, users), HttpStatus.OK);
        } catch (Exception e) {
            GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
            e.printStackTrace();
            return new ResponseEntity<>(resp, HttpStatus.OK);
        }
    }

    @PostMapping(value = "/users/verifyusers")
    public ResponseEntity<?> verifyUsers(
            @RequestBody List<User> users) {
        try {
            if (users.size() > 0) {
                for (User user : users) {
                    System.out.println("user id ##" + user.getId());
                    int upuser = userService.verifyUsers(user.getId());
                    if (upuser < 0) {
                        return new ResponseEntity<>(new UserResponse("there was problem approving users, kindly retry ",
                                false, "201", Api.API_VERSION), HttpStatus.OK);
                    }
                }
                return new ResponseEntity<>(new UserResponse("user's approved successfully ",
                        true, "000", Api.API_VERSION), HttpStatus.OK);
            }
            return new ResponseEntity<>(new UserResponse("There was problem updating users, kindly retry ",
                    false, "201", Api.API_VERSION), HttpStatus.OK);
        } catch (Exception e) {
            GlobalResponse resp = new GlobalResponse("404", "error processing request", false, GlobalResponse.APIV);
            e.printStackTrace();
            return new ResponseEntity<>(resp, HttpStatus.OK);
        }
    }

    public String randomPassword() {
        System.out.println("Generating Password");

        String ALPHA_NUMERIC_STRING = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&?{}*";
        StringBuilder builder = new StringBuilder();

        int count = 8;

        while (count-- != 0) {
            int character = (int) (Math.random() * ALPHA_NUMERIC_STRING.length());
            builder.append(ALPHA_NUMERIC_STRING.charAt(character));
        }
        return builder.toString();


    }

}
