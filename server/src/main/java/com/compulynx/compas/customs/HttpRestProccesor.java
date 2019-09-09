package com.compulynx.compas.customs;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.security.KeyManagementException;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;



public class HttpRestProccesor
{
  public HttpRestProccesor() {}
  
  private static final Logger log = LoggerFactory.getLogger(HttpRestProccesor.class);
  
  public static String postJson(String url, String customID) { 
	  String result = "";
    try
    {
      String httpsURL = url;
      disableSslVerification();
      
      URL myurl = new URL(httpsURL);
      URLConnection urlConnection = myurl.openConnection();
      HttpURLConnection con = null;
      if(urlConnection instanceof  HttpsURLConnection) {
          con = (HttpsURLConnection) urlConnection;
      }else if(urlConnection instanceof HttpURLConnection){
          con = (HttpURLConnection) urlConnection;
      }else{
          log.error("urlConnection is not instance of either HttpsURLConnection or HttpURLConnection");
          return "failed";
      }
      con.setRequestMethod("GET");
      con.setDoOutput(true);
      con.setDoInput(true);
      
      //Set timeout
      con.setReadTimeout(30000);
      con.setConnectTimeout(10000);
      
      int responseCode = con.getResponseCode();
      log.info("Response Code : " + responseCode);

      BufferedReader in = new BufferedReader(
		        new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();

		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		
		result = response.toString();
		in.close();

    
      
      log.info("T24 response for---- " + customID + "----> " + result);
    }
    catch (Exception ex)
    {
      log.error("Error in posting " + ex);
      return "failed";
    }
    return result;
  }
  
  public static void disableSslVerification()
    throws KeyManagementException
  {
    try
    {
    	TrustManager[] trustAllCerts = new TrustManager[] {new X509TrustManager() {
            public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                return null;
            }
            public void checkClientTrusted(X509Certificate[] certs, String authType) {
            }
            public void checkServerTrusted(X509Certificate[] certs, String authType) {
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
      log.error("Error in posting " + ex);
    }
  }
}
