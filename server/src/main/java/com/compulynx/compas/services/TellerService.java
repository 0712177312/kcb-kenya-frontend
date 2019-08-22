package com.compulynx.compas.services;

import java.util.Date;
import java.util.List;

import com.compulynx.compas.models.extras.TellersToApproveDetach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.compulynx.compas.models.Teller;
import com.compulynx.compas.models.extras.TellerToApprove;
import com.compulynx.compas.repositories.TellerRepository;

@Service
public class TellerService {

	@Autowired
	private TellerRepository tellerRepository;

	public Teller checkTeller(String tellerId) {
		// TODO Auto-generated method stub
		return tellerRepository.checkTeller(tellerId);
	}

	public Teller upTellerDetails(Teller teller) {
		// TODO Auto-generated method stub
		return tellerRepository.save(teller);
	}

	public List<Teller> getTellers() {
		// TODO Auto-generated method stub
		return tellerRepository.findAll();
	}

	public Teller getTeller(String tellr) {
		// TODO Auto-generated method stub
		return tellerRepository.getTellerDetails(tellr);
	}

	public List<Teller> getBranchTellers(String branch) {
		// TODO Auto-generated method stub
		return tellerRepository.getBranchTellers(branch);
	}

	public int approveTeller(int createdBy, String customerId) {
		// TODO Auto-generated method stub
		return tellerRepository.approveTellers(createdBy, customerId);
	}

	// Filtered by branch
	public List<TellerToApprove> getTellersToVerify(String branchCode) {
		// TODO Auto-generated method stub
		return tellerRepository.getTellersToApprove(branchCode);
	}

	// All without filters
	public List<TellerToApprove> getTellersToVerifyAll() {
		// TODO Auto-generated method stub
		return tellerRepository.getTellersToApproveAll();
	}

//	public Teller getTellerToVerify(String customerId, String mnemonic) {
//		// TODO Auto-generated method stub
//		return tellerRepository.getTellerToVerify(customerId, mnemonic);
//	}
//
//	public int updateTellerStatus(String customerId) {
//		// TODO Auto-generated method stub
//		return tellerRepository.updateTellerDetails(customerId);
//	}
//
//	public int removeTellerPrints(Long profileId) {
//		// TODO Auto-generated method stub
//		return this.tellerRepository.removeTellerPrints(profileId);
//	}
//
//	public int removeTellerDetails(String customerId) {
//		// TODO Auto-generated method stub
//		return this.tellerRepository.removeTellerDetails(customerId);
//	}

	public int rejectTellerApproval(int rejectedBy, String customerId) {
		return tellerRepository.rejectTellerApproval(rejectedBy, customerId);
	}

	public int removeTeller(int deletedBy, String customerId) {
		return tellerRepository.removeTeller(deletedBy, customerId);
	}

	public int convertStaffToCustomer(String customerId) {
		return tellerRepository.convertStaffToCustomer(customerId);
	}

	public Teller checkStaffApproved(String tellerId) {
		return tellerRepository.checkStaffApproved(tellerId);
	}

	public Teller checkStaffDeleted(String tellerId) {
		return tellerRepository.checkStaffDeleted(tellerId);
	}

	public int staffUnDelete(int createdBy, String tellerId) {
		return tellerRepository.staffUnDelete(createdBy, tellerId);
	}

	public List<TellersToApproveDetach> getTellersToApproveDetach() {
		return tellerRepository.getTellersToApproveDetach();
	}

	public int approveRemoveTeller(String customerId) {
		return tellerRepository.approveRemoveTeller(customerId);
	}

	public int rejectRemoveTeller(String customerId) {
		return tellerRepository.rejectRemoveTeller(customerId);
	}

	public List<Teller> getEnrolledStaff(Date fromDate, Date toDate, String enrolledType) {
		return tellerRepository.getEnrolledStaff(fromDate, toDate, enrolledType);
	}

    public List<Teller> getEnrolledStaffByBranch(Date fromDate, Date toDate, String enrolledType, String branchCode) {
        return tellerRepository.getEnrolledStaffByBranch(fromDate, toDate, enrolledType, branchCode);
    }

}
