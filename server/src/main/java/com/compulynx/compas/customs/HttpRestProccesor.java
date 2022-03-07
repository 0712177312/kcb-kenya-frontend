package com.compulynx.compas.customs;

import java.io.*;
import java.net.*;
import java.security.InvalidKeyException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import com.google.gson.Gson;
import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
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

    public static String postApproveUser(String url, String customID) {

        try (CloseableHttpClient httpclient = HttpClients.createDefault()) {
            disableSslVerification();

            HttpPost httpPost = new HttpPost(url);
            httpPost.setHeader("Content-type", "application/json");

            String json = "{\n    " +
                    "\"userName\": \"I0w8NjGOG/SIY2GgkiSU0w==\",\n    " +
                    "\"passWord\": \"p6wS7JpG9FCD8Ic+tntr9Q==\",\n    " +
                    "\"object\": " +
                    "{\n        " +
                    "\t\t\"id\" " + ":" + "\""
                    + customID +
                    "\"" +
                    "\n" +
                    "}\n" +
                    "}\n";


            System.out.println("calling the T24 url endpoint: " + url);
            System.out.println("here is the json being sent");
            System.out.println(json);



            StringEntity stringEntity = new StringEntity(json);
            httpPost.setEntity(stringEntity);

            System.out.println("Executing request " + httpPost.getRequestLine());

            // Create a custom response handler
            ResponseHandler<String> responseHandler = response -> {
                int status = response.getStatusLine().getStatusCode();
                if (status >= 200 && status < 300) {
                    HttpEntity entity = response.getEntity();

                    return entity != null ? EntityUtils.toString(entity) : null;
                } else {
                    throw new ClientProtocolException("Unexpected response status: " + status);
                }
            };
            String responseBody = httpclient.execute(httpPost, responseHandler);

            ResponseBody resBody = new Gson().fromJson(responseBody, ResponseBody.class);

            if (resBody != null) {
                if (resBody.message != null){
                    log.info("T24 response for---- " + customID + "----> " + resBody.message);
                    return resBody.message;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "failed";
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
            String customerName = params[0];
            String recipient = convertPhoneToFormatThatSmsGatewayRecognizes(params[1]);
            parameters.put("action", "sendmessage");
            parameters.put("username", params[2]);
            parameters.put("password", params[3]);
            parameters.put("recipient", recipient);
            parameters.put("messagetype", "SMS");
            parameters.put("messagedata", "Dear " + customerName + ", your biometric details have been successfully registered. For any queries please call 0711087000 or 0732187000.");

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

    /*
     * The sms gateway recongnizes phones of the form 245XXXXXXXXX
     */
    private static String convertPhoneToFormatThatSmsGatewayRecognizes(String phoneNumber) {
        if(phoneNumber == null){
            return "";
        }
        // if number begins with +, then remove the +
        if (phoneNumber.startsWith("+")) {
            return phoneNumber.substring(1);
        } else if (phoneNumber.startsWith("0")) {
            // if number begins with 0, then replace the 0 with 254
            phoneNumber = phoneNumber.substring(1);
            return "254" + phoneNumber;
        }else{
            return phoneNumber;
        }
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

class ResponseBody {
    public String message;
    public String payload;
    public Boolean requestStatus;

}