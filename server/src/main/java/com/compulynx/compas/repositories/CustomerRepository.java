package com.compulynx.compas.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.compulynx.compas.models.Customer;
import com.compulynx.compas.models.Teller;
import com.compulynx.compas.models.extras.CustomersToApprove;
import com.compulynx.compas.models.extras.MatchingTeller;
import com.compulynx.compas.models.extras.TopFiveBranches;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
	
	@Query("select u from Customer u where (u.customerId = ?1 or u.mnemonic =?2) and (u.verified='A' or u.verified='N')")
	Customer findCustomerByCustomerId(String customerId, String mnemonic);
	
	@Query(nativeQuery = true, value ="SELECT ROWNUM AS COUNTER,CUSTOMERID, " +
			"CU.CUSTOMERNAME,CUSTOMERIDNUMBER,CU.PHONENUMBER,CU.COUNTRY,TO_CHAR(CU.CREATED_AT,'dd-mm-rrrr') AS ENROLLEDON,UM.FULLNAME AS CREATEDBY, UM.ID AS USERSID " +
			"from CUSTOMER CU " +
			"INNER JOIN USERMASTER UM ON UM.ID = CU.CREATED_BY AND CU.VERIFIED = 'N'")
	List<CustomersToApprove> getCustomersToApprove();

	@Query(nativeQuery = true, value ="SELECT ROWNUM AS COUNTER,CUSTOMERID, " +
			"CU.CUSTOMERNAME,CUSTOMERIDNUMBER,CU.PHONENUMBER,CU.COUNTRY,TO_CHAR(CU.CREATED_AT,'dd-mm-rrrr') AS ENROLLEDON,UM.FULLNAME AS CREATEDBY, UM.ID AS USERSID " +
			"from CUSTOMER CU " +
			"INNER JOIN USERMASTER UM ON UM.ID = CU.CREATED_BY AND CU.VERIFIED = 'D'")
	List<CustomersToApprove> getCustomersToApproveDetach();
	
	@Modifying
	@Transactional
	@Query(nativeQuery = true, value ="UPDATE customer set verified='A',verified_by=?1, verified_on=systimestamp  WHERE customerId=?2 and verified<>'D'")
	int approveCustomers(int verifiedBy, String customerId);
	
	@Query(nativeQuery=true, value="SELECT * from customer  where customerId =?1")
	Customer identifyCustomer(String customerId);
	
	@Query("select u from Customer u where u.customerId=?1")
	Customer getCustomerToWaive(String customerId);
	
	@Modifying
	@Transactional
	@Query(nativeQuery = true, value="UPDATE customer set waived='W',waived_by=?1, customerwaived_on=systimestamp  WHERE customerId=?2")
	int waiveCustomer(int waivedBy, String customerId);
	
	@Query("select u from Customer u where u.waived='W' or u.waived='A'")
	List<Customer> getWaiveCustomers();
	
	@Modifying
	@Transactional
	@Query(nativeQuery=true, value="UPDATE customer set waived=?1, waive_approved_by=?2, approvedcustomerwaive_on=systimestamp WHERE customerId=?3 ")
	int approveCustomerWaive(String waived, int approvedBy, String customerId);

	@Query("select u from Customer u where u.customerId=?1 and (u.verified <> 'R' or u.verified <> 'D')")
	Customer getMatchedCustomers(String customerId);
	
	@Query(nativeQuery=true, value="select u.id, u.customerId, u.tellerName as customerName, u.tellerId as customerIdNumber, '' as country, "
			+ " '' as gender, '' as phoneNumber from tellermaster u where u.customerId=?1")
	MatchingTeller getMatchedTellers(String customerId);

	@Modifying
	@Transactional
	@Query(nativeQuery=true, value="UPDATE customer set waived='R', waive_approved_by=?1, approvedcustomerwaive_on=systimestamp WHERE customerId=?2 ")
	int rejeCustomerWaive(int waivedApprovedBy, String customerId);

//	@Query("select u from Customer u")
//	List<Customer> getEnrolledCustomers(Date fromDate, Date toDate);
	
	 @Query("select u from Customer u where u.createdOn BETWEEN :fromDate AND :toDate AND u.verified=:enrolledType")
	 List<Customer> getEnrolledCustomers(@Param("fromDate") Date fromDate, @Param("toDate") Date toDate, @Param("enrolledType") String enrolledType);
//	 
//	 
//	 @Query("select count(u) from Customer u")
//	 int countEnrolledCustomers();
//	 
	 @Query("select count(u) from Customer u where u.waived='W'")
	 int countWaivedCustomersToApprove();
	 
	 @Query("select count(u) from Customer u where u.waived='A'")
	 int countWaivedCustomersAndApproved();
	 
	 @Query("select count(u) from Customer u where u.waived='R'")
	 int countWaivedCustomersAndRejected();
	 
	 @Query("select count(u) from Customer u")
	 int getCustomerCount();
	 
	 @Query("select count(DISTINCT u.branchCode) from Customer u")
	 int getEnrolledBranchesCount();
	 
	 @Query(nativeQuery = true, 
//			 value = "SELECT SUBSTR(BR.BRANCH_NAME, 1, 2) AS INITIALS, " + 
//			 		"BR.BRANCH_NAME AS BRANCHNAME, CO.NAME AS COUNTRY,  " + 
//			 		"(SELECT COUNT(ID) FROM CUSTOMER CU WHERE CU.BRANCH_CODE = BR.BRANCHCODE AND CU.WAIVED='A' OR CU.WAIVED='W') AS WAIVEDCUSTOMERS, " + 
//			 		"(SELECT COUNT(ID) FROM CUSTOMER CU WHERE CU.BRANCH_CODE = BR.BRANCHCODE) AS ENROLLEDCUSTOMERS " + 
//			 		"FROM BRANCH BR  " + 
//			 		"INNER JOIN COUNTRY CO ON BR.COUNTRY_CODE = CO.COUNTRYCODE " + 
//			 		" ORDER BY ENROLLEDCUSTOMERS DESC " + 
//			 		" FETCH NEXT 5 ROWS ONLY")
			 value = "SELECT SUBSTR(BR.BRANCH_NAME, 1, 2) AS INITIALS,  \r\n" + 
			 		"			 		BR.BRANCH_NAME AS BRANCHNAME, CO.NAME AS COUNTRY,  \r\n" + 
			 		"			 		(SELECT COUNT(ID) FROM CUSTOMER CU WHERE CU.BRANCH_CODE = BR.BRANCHCODE \r\n" + 
			 		"          AND CU.WAIVED='A' OR CU.WAIVED='W') AS WAIVEDCUSTOMERS,  \r\n" + 
			 		"			 		(SELECT COUNT(ID) FROM CUSTOMER CU WHERE CU.BRANCH_CODE = BR.BRANCHCODE) AS ENROLLEDCUSTOMERS \r\n" + 
			 		"			 		FROM BRANCH BR   \r\n" + 
			 		"			 		INNER JOIN COUNTRY CO ON BR.COUNTRY_CODE = CO.COUNTRYCODE  \r\n" + 
			 		"			 		ORDER BY ENROLLEDCUSTOMERS DESC FETCH NEXT 5 ROWS ONLY")
	 List<TopFiveBranches> getTopFiveBranches();

	@Modifying
	@Transactional
	@Query(nativeQuery=true, value="update customer set WAIVED='T'  WHERE customerId=?1 ")
	int upgradeCustomerDetails(String customerId);

	@Modifying
	@Transactional
	@Query(nativeQuery=true, value="UPDATE customer set verified='R',rejected_by=?1,rejected_on=systimestamp WHERE customerId=?2")
	int rejectCustomerEnrollment(int rejectedBy,String customerId);

	@Modifying
	@Transactional
	@Query(nativeQuery = true, value ="UPDATE customer set verified='D',deleted_by=?1, deleted_on=systimestamp  WHERE customerId=?2")
	int deleteCustomers(int deletedBy, String customerId);

	@Modifying
	@Transactional
	@Query(nativeQuery = true, value ="UPDATE customer set verified='AD' WHERE customerId=?1")
	int approveRemoveCustomer(String customerId);

	@Modifying
	@Transactional
	@Query(nativeQuery = true, value ="UPDATE customer set verified='N' WHERE customerId=?1")
	int rejectRemoveCustomer(String customerId);


}
