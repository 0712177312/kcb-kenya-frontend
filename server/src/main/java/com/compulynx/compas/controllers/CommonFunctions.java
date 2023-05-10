package com.compulynx.compas.controllers;

import java.io.IOException;
import java.security.KeyManagementException;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.Calendar;
import java.util.Date;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import com.fasterxml.jackson.databind.ObjectMapper;

public class CommonFunctions {
	public static void disableSslVerification()
            throws KeyManagementException {
        try {
            TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager() {
                public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                    return null;
                }

        
				@Override
				public void checkClientTrusted(X509Certificate[] chain, String authType)
						throws CertificateException {
					// TODO Auto-generated method stub
					
				}

				@Override
				public void checkServerTrusted(X509Certificate[] chain, String authType)
						throws CertificateException {
					// TODO Auto-generated method stub
					
				}
            }
            };
            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());


            HostnameVerifier allHostsValid = new HostnameVerifier() {
                public boolean verify(String hostname, SSLSession session) {
                    return true;
                }
            };

            // Install the all-trusting host verifier
            HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
        } catch (Exception ex) {
           // log.error("Error in posting " + ex);
        }
    }
 
 public static void configHttpsUrlConnection(HttpsURLConnection httpsURLConnection) {
		try {
			httpsURLConnection.setDoInput(true);
			httpsURLConnection.setDoOutput(true);
			httpsURLConnection.setRequestMethod("POST");
			httpsURLConnection.setConnectTimeout(10000);
			httpsURLConnection.setReadTimeout(10000);
		}catch(Exception ex) {
			ex.printStackTrace();
			//logger.error("Error in configuring HttpsUrlConnection() : "+ex.getMessage());
		}
		
	}
	public static String convertPojoToJson(Object obj) {
		String getAuthJsonStr ="";
		ObjectMapper mapper = new ObjectMapper();  
        try {  
           
        	getAuthJsonStr = mapper.writeValueAsString(obj);  
        }  
        catch (IOException e) {  
            e.printStackTrace();  
            //logger.error("Error : "+e.getMessage());
        } 
        return getAuthJsonStr;
	}

    public static Date getOneDayPlusDate(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, +1);
        return calendar.getTime();
    }


}
