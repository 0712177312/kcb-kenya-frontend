package com.compulynx.compas.repositories;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.compulynx.compas.models.User;
import com.compulynx.compas.models.extras.UsersToVerify;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	User findByUsername(String username);
	
	@Query("select u from User u where u.username=?1 and u.password=?2")
	User findByUsernameAndPassword(String username, String password);
	
//	@Query(nativeQuery = true, value ="SELECT ROW_NUMBER() OVER(ORDER BY u.id) as counter,  " + 
//			" u.id,u.created_by as createdBy, u.fullname as fullName ,um.GroupName as groupName,convert(date,u.created_at) as createdAt " + 
//			" FROM users u " + 
//			" inner join usergroupsmaster um on um.id=u.group_id " + 
//			" where u.verified<>'V' and u.status=1")
	@Query(nativeQuery = true, value="SELECT ROW_NUMBER() OVER(ORDER BY u.id) as counter,  " + 
			"     u.id,u.created_by as createdBy, u.fullname as fullName ,um.GroupName as groupName,to_char(u.CREATED_AT, 'dd-mm-rrrr') as createdAt " + 
			"			 FROM USERMASTER u  " + 
			"			 inner join usergroupsmaster um on um.id=u.group_id" + 
			"			 where u.verified<>'V' and u.status=1")
	List<UsersToVerify> getUsersToVerify();
//	int getCounter();
//	int getId();
//	int getCreatedBy();
//	String getFullName();
//	String getGroupName();
//	Date getCreatedAt();
	@Query("select count(u) from User u")
	int getUserCount();
	
	@Modifying
	@Transactional
	@Query(nativeQuery = true, value ="UPDATE USERMASTER set verified='V', verified_on=systimestamp WHERE id=?1")
	int approveUsers(Long id);
	
	@Query("select u from User u where u.username=?1")
	User manualAuth(String username);

	@Modifying
	@Transactional
//	@Query(nativeQuery = true, value = "UPDATE users set verified='N',fullname=?1,email=?2,phone=?3,group_id=?4,branchId=?5 WHERE id=?6")
	@Query(nativeQuery = true, value = "UPDATE USERMASTER set verified='N',group_id=?1, status=?2 WHERE id=?3")
	int updateUsers(int group, boolean status, Long userId);


	@Modifying
	@Transactional
	@Query(nativeQuery = true, value = "UPDATE USERMASTER set verified='N',group_id=?1, status=?2, locked='0', trials='0' WHERE id=?3")
	int updateUsersAndUnlock(int group, boolean status, Long userId);

	@Modifying
	@Transactional
	@Query(nativeQuery = true, value = "UPDATE USERMASTER set status='1', verified='N' WHERE username=?1")
	int updateStatusToTrue(String username);

	@Modifying
	@Transactional
	@Query(nativeQuery = true, value = "UPDATE USERMASTER set status='0' WHERE username=?1")
	int updateStatusToFalse(String username);

	@Query("select u from User u where u.branch=:branchCode and id<>:userId")
	List<User> getAllUsersByBranchExcludingCurrentUser(String branchCode, Long userId);
	@Modifying
	@Transactional
	@Query(nativeQuery = true, value = "UPDATE USERMASTER set trials=trials+1 WHERE username=?1")
	int updateUsertrials(String username);
	@Modifying
	@Transactional
	@Query(nativeQuery = true, value = "UPDATE USERMASTER set locked='1' WHERE username=?1")
	int updateUserlocked(String username);

}
