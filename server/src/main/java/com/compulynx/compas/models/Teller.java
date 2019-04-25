package com.compulynx.compas.models;

import java.util.Date;
import java.util.List;

import javax.persistence.*;

import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name="tellermaster")
public class Teller extends BaseModel{
	@Column(unique=true)
	private String tellerId;
	private String tellerStatus;
	private String deptCode;
	private String recordStatus;
	private String tellerEmail;
	private String tellerName;
	@Column(unique=true)
	private String tellerSignOnName;
	private String departmentCode;
	private String companyCode;
	private String customerId;
	private String verified;
	private int createdBy;
	private int verifiedBy;
    @Column(name="verified_on")
    private Date approvedOn;
    @Column(name = "created_at", nullable = false,updatable = false)
    @CreationTimestamp
    private Date createdOn;
	protected Teller() {
		
	}
	
	public Teller(String tellerId, String tellerStatus, String deptCode, String recordStatus, String tellerEmail,
			String tellerName, String tellerSignOnName, String departmentCode, String companyCode,
			String customerId,String verified, int createdBy, int verifiedBy, 
			Date approvedOn, Date createdOn, String enrollStatus) {
		super();
		this.tellerId = tellerId;
		this.tellerStatus = tellerStatus;
		this.deptCode = deptCode;
		this.recordStatus = recordStatus;
		this.tellerEmail = tellerEmail;
		this.tellerName = tellerName;
		this.tellerSignOnName = tellerSignOnName;
		this.departmentCode = departmentCode;
		this.companyCode = companyCode;
		this.customerId = customerId;
		this.verified = verified;
		this.createdBy = createdBy;
		this.verifiedBy = verifiedBy;
		this.approvedOn = approvedOn;
		this.createdOn = createdOn;
	}

	public Date getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Date createdOn) {
		this.createdOn = createdOn;
	}

	public Date getApprovedOn() {
		return approvedOn;
	}

	public void setApprovedOn(Date approvedOn) {
		this.approvedOn = approvedOn;
	}

	public int getVerifiedBy() {
		return verifiedBy;
	}

	public void setVerifiedBy(int verifiedBy) {
		this.verifiedBy = verifiedBy;
	}

	public int getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(int createdBy) {
		this.createdBy = createdBy;
	}

	public String getVerified() {
		return verified;
	}

	public void setVerified(String verified) {
		this.verified = verified;
	}

	public String getTellerId() {
		return tellerId;
	}

	public void setTellerId(String tellerId) {
		this.tellerId = tellerId;
	}

	public String getTellerStatus() {
		return tellerStatus;
	}

	public void setTellerStatus(String tellerStatus) {
		this.tellerStatus = tellerStatus;
	}

	public String getDeptCode() {
		return deptCode;
	}

	public void setDeptCode(String deptCode) {
		this.deptCode = deptCode;
	}

	public String getRecordStatus() {
		return recordStatus;
	}

	public void setRecordStatus(String recordStatus) {
		this.recordStatus = recordStatus;
	}

	public String getTellerEmail() {
		return tellerEmail;
	}

	public void setTellerEmail(String tellerEmail) {
		this.tellerEmail = tellerEmail;
	}

	public String getTellerName() {
		return tellerName;
	}

	public void setTellerName(String tellerName) {
		this.tellerName = tellerName;
	}

	public String getTellerSignOnName() {
		return tellerSignOnName;
	}

	public void setTellerSignOnName(String tellerSignOnName) {
		this.tellerSignOnName = tellerSignOnName;
	}

	public String getDepartmentCode() {
		return departmentCode;
	}

	public void setDepartmentCode(String departmentCode) {
		this.departmentCode = departmentCode;
	}

	public String getCompanyCode() {
		return companyCode;
	}

	public void setCompanyCode(String companyCode) {
		this.companyCode = companyCode;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}
}
