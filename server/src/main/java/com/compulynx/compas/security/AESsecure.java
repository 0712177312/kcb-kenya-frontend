package com.compulynx.compas.security;

import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;


@Component
public class AESsecure {

	private SecretKeySpec secretKey;
	private byte[] key;

	public void setKey() {
		try {
			secretKey = new SecretKeySpec("@compulynx#54321".getBytes("UTF-8"), "AES");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	public String encrypt(String strToEncrypt) {
		try {
			setKey();
			Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");
			cipher.init(Cipher.ENCRYPT_MODE, secretKey);
			return Base64.getEncoder().encodeToString(cipher.doFinal(strToEncrypt.getBytes("UTF-8")));
		} catch (Exception e) {
			System.out.println("Error while encrypting: " + e.toString());
		}
		return null;
	}

	public String decrypt(String strToDecrypt) {
		try {
			setKey();
			Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");
			cipher.init(Cipher.DECRYPT_MODE, secretKey);
			return new String(cipher.doFinal(Base64.getDecoder().decode(strToDecrypt)));
		} catch (Exception e) {
			System.out.println("Error while decrypting: " + e.toString());
		}
		return null;
	}

	public String HmacHash(String content, String key, String encodingMAC) {
		// Sample HmacSHA512,HmacSHA256
		Mac enctype = null;
		String result = null;
		try {
			enctype = Mac.getInstance(encodingMAC);
			SecretKeySpec keySpec = new SecretKeySpec(key.getBytes("UTF-8"), encodingMAC);
			enctype.init(keySpec);
			byte[] mac_data = enctype.doFinal(content.getBytes("UTF-8"));
			result = convertToHex(mac_data);
		} catch (NoSuchAlgorithmException | UnsupportedEncodingException | InvalidKeyException
				| IllegalStateException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return result;
	}

	public String convertToHex(byte[] raw) {
		int substring = 1;
		int length = 16;
		int size = 200;
		StringBuilder stringBuilder = new StringBuilder(size);
		for (int i = 0; i < raw.length; i++) {

			stringBuilder.append(Integer.toString((raw[i] & 0xff) + 0x100, length).substring(substring));
		}
		return stringBuilder.toString();
	}

	public String generateSecretKey() {
		final String ALPHA_NUMERIC_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		StringBuilder builder = new StringBuilder();
		int count = 20;

		while (count-- != 0) {
			int character = (int) (Math.random() * ALPHA_NUMERIC_STRING.length());
			builder.append(ALPHA_NUMERIC_STRING.charAt(character));
		}

		return builder.toString();
	}

	public String generateEncryptionKey() {
		final String ALPHA_NUMERIC_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		StringBuilder builder = new StringBuilder();
		int count = 16;

		while (count-- != 0) {
			int character = (int) (Math.random() * ALPHA_NUMERIC_STRING.length());
			builder.append(ALPHA_NUMERIC_STRING.charAt(character));
		}

		return builder.toString();
	}
}