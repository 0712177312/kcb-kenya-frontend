package com.compulynx.compas.services;

import java.util.List;

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
		return tellerRepository.approveTellers(createdBy,customerId);
	}

	public List<TellerToApprove> getTellersToVerify() {
		// TODO Auto-generated method stub
		return tellerRepository.getTellersToApprove();
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
	
	
}
