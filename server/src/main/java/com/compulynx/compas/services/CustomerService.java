package com.compulynx.compas.services;

import java.util.Date;
import java.util.List;

import com.compulynx.compas.models.extras.CustomersToApproveDetach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.compulynx.compas.models.Customer;
import com.compulynx.compas.models.Teller;
import com.compulynx.compas.models.extras.CustomersToApprove;
import com.compulynx.compas.models.extras.MatchingTeller;
import com.compulynx.compas.repositories.CustomerRepository;

@Service
public class CustomerService {

	@Autowired
	private CustomerRepository customerRepository;

	public List<Customer> getCustomers() {
		// TODO Auto-generated method stub
		return customerRepository.findAll();
	}

	public Customer checkCustomer(String gifNumber, String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.findCustomerByCustomerId(gifNumber, customerId);
	}

	public Customer upCustomerDetails(Customer customer) {
		// TODO Auto-generated method stub
		return customerRepository.save(customer);
	}

	public List<CustomersToApprove> getCustomersToVerify(String branchCode) {
		return customerRepository.getCustomersToApprove(branchCode);
	}

	public List<CustomersToApprove> getCustomersToVerifyAll() {
		return customerRepository.getCustomersToApproveAll();
	}



	public int approveCustomer(int verifiedBy, String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.approveCustomers(verifiedBy, customerId);
	}

	public Customer identifyCustomer(String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.identifyCustomer(customerId);
	}

	public Customer getCustomerToWaive(String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.getCustomerToWaive(customerId);
	}

	public int waiveCustomer(int waivedBy, String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.waiveCustomer(waivedBy, customerId);
	}

	public List<Customer> getWaiveCustomers() {
		// TODO Auto-generated method stub
		return customerRepository.getWaiveCustomers();
	}

	public int approveCustomerWaive(String waived, int approvedBy, String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.approveCustomerWaive(waived, approvedBy, customerId);
	}

	public Customer getMatchedCustomers(String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.getMatchedCustomers(customerId);
	}

	public MatchingTeller getMatchedTellers(String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.getMatchedTellers(customerId);
	}

	public int rejectCustomerWaive(int waivedApprovedBy, String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.rejeCustomerWaive(waivedApprovedBy, customerId);
	}

	public List<Customer> gtEnrolledCustomers(Date fromDate, Date toDate, String enrolledType) {
		// TODO Auto-generated method stub
		System.out.println("from date: " + fromDate);
		System.out.println("to date: " + toDate);
		System.out.println("enrolled type: " + enrolledType);
		return customerRepository.getEnrolledCustomers(fromDate, toDate, enrolledType);
	}

	public List<Customer> getEnrolledCustomersByBranch(Date fromDate, Date toDate, String enrolledType,
													   String branchCode) {
		return customerRepository.getEnrolledCustomersByBranch(fromDate, toDate, enrolledType, branchCode);
	}

//	public Customer getCustomerToVerify(String mnemonic, String mnemonic2) {
//		// TODO Auto-generated method stub
//		return customerRepository.getCustomerToVerify(mnemonic, mnemonic2);
//	}
//
//	public int updateCustomerStatus(String customerId) {
//		// TODO Auto-generated method stub
//		return customerRepository.updateCustomerDetails(customerId);
//	}
//
//	public int removeCustomerPrints(Long profileId) {
//		// TODO Auto-generated method stub
//		return customerRepository.removeCustomerPrints(profileId);
//	}

//	public int removeCustomerProfile(String customerId) {
//		// TODO Auto-generated method stub
//		return customerRepository.removeCustomerDetails(customerId);
//	}

	public int upgradeCustomerProfile(String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.upgradeCustomerDetails(customerId);
	}

	public int rejectCustomerEnrollment(int rejectedBy, String customerId) {
		return customerRepository.rejectCustomerEnrollment(rejectedBy, customerId);
	}

	public int deleteCustomer(int deletedBy, String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.deleteCustomer(deletedBy, customerId);
	}

//	public List<Customer> gtEnrolledCustomers(Date fromDate, Date toDate) {
//		// TODO Auto-generated method stub
//		return customerRepository.getAll(fromDate,toDate);
//	}

	public List<CustomersToApproveDetach> getCustomersToApproveDetach() {
		return customerRepository.getCustomersToApproveDetach();
	}

	public int approveRemoveCustomer(String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.approveRemoveCustomer(customerId);
	}

	public int rejectRemoveCustomer(String customerId) {
		// TODO Auto-generated method stub
		return customerRepository.rejectRemoveCustomer(customerId);
	}

	public Customer checkCustomerDeleted(String customerId) {
		return customerRepository.checkCustomerDeleted(customerId);
	}

	public int customerUnDelete(int createdBy, String customerId) {
		return customerRepository.customerUnDelete(createdBy, customerId);
	}

}
