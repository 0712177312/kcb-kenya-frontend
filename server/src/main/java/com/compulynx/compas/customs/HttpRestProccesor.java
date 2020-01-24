package com.compulynx.compas.customs;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.*;
import java.security.KeyManagementException;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.Map;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class HttpRestProccesor {
    public HttpRestProccesor() {
    }

    private static final Logger log = LoggerFactory.getLogger(HttpRestProccesor.class);

    public static String postJson(String url, String customID) {
        String result = "";
        try {
            String httpsURL = url;
            disableSslVerification();

            URL myurl = new URL(httpsURL);
            URLConnection urlConnection = myurl.openConnection();
            HttpURLConnection con = null;
            if (urlConnection instanceof HttpsURLConnection) {
                con = (HttpsURLConnection) urlConnection;
            } else if (urlConnection instanceof HttpURLConnection) {
                con = (HttpURLConnection) urlConnection;
            } else {
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
        } catch (Exception ex) {
            log.error("Error in posting " + ex);
            return "failed";
        }
        return result;
    }

    public static void disableSslVerification()
            throws KeyManagementException {
        try {
            TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager() {
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


    public static String sendGetRequest(String getRequestUrl, String tag, String... params) throws Exception {
        URL url = new URL(getRequestUrl);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("GET");

        Map<String, String> parameters = new HashMap<>();

        if (tag.equals("sms")) {
            parameters.put("phoneNumber", params[0]);
            parameters.put("smsApiUsername", params[1]);
            parameters.put("smsApiPassword", params[2]);
        } else {
            for (int i = 0; i < params.length; i++) {
                parameters.put("param" + i, params[i]);
            }
        }

        con.setDoOutput(true);
        DataOutputStream out = new DataOutputStream(con.getOutputStream());
        out.writeBytes(ParameterStringBuilder.getParamsString(parameters));
        out.flush();
        out.close();

        // Configure timeouts
        con.setConnectTimeout(5000);
        con.setReadTimeout(5000);

        int status = con.getResponseCode();
        BufferedReader in = new BufferedReader(
                new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuffer content = new StringBuffer();
        while ((inputLine = in.readLine()) != null) {
            content.append(inputLine);
        }

        in.close();
        con.disconnect();
        return content.toString();
    }

    public static class ParameterStringBuilder {
        public static String getParamsString(Map<String, String> params)
                throws UnsupportedEncodingException {
            StringBuilder result = new StringBuilder();

            for (Map.Entry<String, String> entry : params.entrySet()) {
                result.append(URLEncoder.encode(entry.getKey(), "UTF-8"));
                result.append("=");
                result.append(URLEncoder.encode(entry.getValue(), "UTF-8"));
                result.append("&");
            }

            String resultString = result.toString();
            return resultString.length() > 0
                    ? resultString.substring(0, resultString.length() - 1)
                    : resultString;
        }
    }
}
