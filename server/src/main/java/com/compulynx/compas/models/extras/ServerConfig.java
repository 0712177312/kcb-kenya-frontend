package com.compulynx.compas.models.extras;

public class ServerConfig {
	private String t24;
	private String cobanking;
	private String abis;
	private String greenbit;
	private String secugen;
	private String authPs;
	private String authUsr;
	
	public ServerConfig(String t24, String cobanking, String abis, String greenbit, String secugen, String authPs, String authUsr) {
		super();
		this.t24 = t24;
		this.cobanking = cobanking;
		this.abis = abis;
		this.greenbit = greenbit;
		this.secugen = secugen;
		this.authPs=authPs;
		this.authUsr=authUsr;
	}
	public String getGreenbit() {
		return greenbit;
	}
	public void setGreenbit(String greenbit) {
		this.greenbit = greenbit;
	}
	public String getSecugen() {
		return secugen;
	}
	public void setSecugen(String secugen) {
		this.secugen = secugen;
	}
	public String getT24() {
		return t24;
	}
	public void setT24(String t24) {
		this.t24 = t24;
	}
	public String getCobanking() {
		return cobanking;
	}
	public void setCobanking(String cobanking) {
		this.cobanking = cobanking;
	}
	public String getAbis() {
		return abis;
	}
	public void setAbis(String abis) {
		this.abis = abis;
	}
	public String getAuthPs() {
		return authPs;
	}
	public void setAuthPs(String authPs) {
		this.authPs = authPs;
	}
	public String getAuthUsr() {
		return authUsr;
	}
	public void setAuthUsr(String authUsr) {
		this.authUsr = authUsr;
	}
	
}
