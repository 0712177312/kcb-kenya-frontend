package com.compulynx.compas.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.compulynx.compas.models.Teller;
import com.compulynx.compas.models.extras.TellerToApprove;

@Repository
public interface TellerRepository extends JpaRepository<Teller, Long>{

	@Query("select u from Teller u where u.tellerId=?1 and (u.verified='A' or u.verified='N')")
	Teller checkTeller(String tellerId);
	
	@Query("select u from Teller u where u.tellerSignOnName=?1")
	Teller getTellerDetails(String tellr);
	
	@Query("select u from Teller u where u.verified='A' and u.departmentCode=?1")
	List<Teller> getBranchTellers(String branch);
	
	@Modifying
	@Transactional
	@Query(nativeQuery = true, value ="UPDATE tellermaster set verified='A',verifiedby=?1, verified_on=systimestamp  WHERE customerId=?2 and verified<>'D'")
	int approveTellers(int createdBy, String customerId);
	
	@Query(nativeQuery = true, value ="SELECT ROWNUM AS COUNTER,customerId, " + 
			"CU.tellerName,TO_CHAR(CU.CREATED_AT,'dd-mm-rrrr') AS ENROLLEDON,UM.FULLNAME AS CREATEDBY, UM.ID AS USERSID " + 
			"from tellermaster CU " + 
			"INNER JOIN USERMASTER UM ON UM.ID = CU.createdBy AND CU.VERIFIED = 'N'")
	List<TellerToApprove> getTellersToApprove();

//	@Query("select u from Teller u where u.customerId=?1 OR tellerSignOnName=?2  AND u.enrollStatus<>'A'")
//	Teller getTellerToVerify(String customerId, String mnemonic);
//
//	@Modifying
//	@Transactional
//	@Query(nativeQuery=true, value="UPDATE tellermaster set ENROLL_STATUS='A' WHERE customerId=?1 ")
//	int updateTellerDetails(String customerId);
//
//	@Modifying
//	@Transactional
//	@Query(nativeQuery=true, value="DELETE teller_prints  WHERE profile=?1 ")
//	int removeTellerPrints(Long profileId);
//
//	@Modifying
//	@Transactional
//	@Query(nativeQuery=true, value="DELETE tellermaster  WHERE customerId=?1 ")
//	int removeTellerDetails(String customerId);

	@Modifying
	@Transactional
	@Query(nativeQuery = true, value ="UPDATE tellermaster set verified='R', rejected_by=?1, rejected_on=systimestamp WHERE customerId=?2")
	int rejectTellerApproval(int rejectedBy,String customerId);

	@Modifying
	@Transactional
	@Query(nativeQuery = true, value ="UPDATE tellermaster set verified='D',deleted_by=?1, deleted_on=systimestamp WHERE customerId=?2")
	int removeTeller(int deletedBy, String customerId);


	@Modifying
	@Transactional
	@Query(nativeQuery=true, value="update tellermaster set verified='T'  WHERE customerId=?1 ")
	int convertStaffToCustomer(String customerId);

	@Query("select u from Teller u where u.tellerId=?1 and verified='A'")
	Teller checkStaffApproved(String tellerId);

	@Query("select u from Teller u where u.tellerId=?1 and (verified='D' or verified='R')")
	Teller checkStaffDeleted(String tellerId);

	@Modifying
	@Transactional
	@Query(nativeQuery=true, value="update tellermaster set verified='N',createdby=?1, created_at=systimestamp WHERE tellerid=?2")
	int staffUnDeleted(int createdBy, String tellerid);
}
