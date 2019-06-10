package com.compulynx.compas.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.compulynx.compas.models.User;
import com.compulynx.compas.models.extras.UsersToVerify;
import com.compulynx.compas.repositories.UserRepository;
import com.compulynx.compas.security.AES;

@Service
public class UserService {
	@Autowired
    private UserRepository userRepo;
	
	@Autowired
	public UserService(UserRepository userRepo) {
		super();
		this.userRepo = userRepo;
	}

	public List<User> getUsers() {
		return userRepo.findAll();
	}

	public User findByUsername(String username) {
		// TODO Auto-generated method stub
		return userRepo.findByUsername(username);
	}

	public User addUser(User user) {
		// TODO Auto-generated method stub
		return userRepo.save(user);
	}

	public User authUser(User user) throws Exception {
		//System.out.println(user.getPassword());
		//System.out.println("user password####"+user.getPassword());
		System.out.println("user password####"+user.getUsername());
		return userRepo.findByUsernameAndPassword(user.getUsername(),AES.encrypt(user.getPassword()));
	}

	public List<UsersToVerify> getUsersToVerify() {
		// TODO Auto-generated method stub
		return userRepo.getUsersToVerify();
	}

	public int verifyUsers(Long id) {
		// TODO Auto-generated method stub
		return userRepo.approveUsers(id);
	}

	public int updateUsers(int group, boolean status, Long userId) {
		// TODO Auto-generated method stub
		return userRepo.updateUsers(group, status, userId);
	}
}
