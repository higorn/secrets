package io.esecrets.capacitor.autofill.helper;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.security.KeyPairGeneratorSpec;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import android.util.Log;

import com.getcapacitor.JSObject;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.KeyPairGenerator;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.SecureRandom;
import java.security.UnrecoverableEntryException;
import java.security.cert.CertificateException;
import java.util.ArrayList;

import javax.crypto.Cipher;
import javax.crypto.CipherInputStream;
import javax.crypto.CipherOutputStream;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

public class BiometricCredentialsHelper {
  private static final String ANDROID_KEY_STORE = "AndroidKeyStore";
  private static final String TRANSFORMATION = "AES/GCM/NoPadding";
  private static final String RSA_MODE = "RSA/ECB/PKCS1Padding";
  private static final String AES_MODE = "AES/ECB/PKCS7Padding";
  private static final byte[] FIXED_IV = new byte[12];
  private static final String ENCRYPTED_KEY = "NativeBiometricKey";
  private static final String NATIVE_BIOMETRIC_SHARED_PREFERENCES = "NativeBiometricSharedPreferences";
  private static final String TAG = BiometricCredentialsHelper.class.getSimpleName();

  private BiometricCredentialsHelper() {
  }

  public static JSObject getCredentials(Context context, String server) {
    String KEY_ALIAS = server;

    SharedPreferences sharedPreferences = context.getSharedPreferences(NATIVE_BIOMETRIC_SHARED_PREFERENCES, Context.MODE_PRIVATE);
    String username = sharedPreferences.getString("username", null);
    String password = sharedPreferences.getString("password", null);
    if (KEY_ALIAS != null) {
      if (username != null && password != null) {
        try {
          JSObject jsObject = new JSObject();
          jsObject.put("username", decryptString(username, KEY_ALIAS, context));
          jsObject.put("password", decryptString(password, KEY_ALIAS, context));
          return jsObject;
        } catch (GeneralSecurityException | IOException e) {
          Log.e(TAG, e.getMessage(), e);
          throw new BiometricCredentialsAccessException();
        }
      } else {
        Log.e(TAG, "No credentials found");
        throw new BiometricCredentialsAccessException();
      }
    } else {
      Log.e(TAG, "No server name was provided");
      throw new BiometricCredentialsAccessException();
    }
  }

  private static String encryptString(String stringToEncrypt, String KEY_ALIAS, Context context)
      throws GeneralSecurityException, IOException {
    Cipher cipher;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      cipher = Cipher.getInstance(TRANSFORMATION);
      cipher.init(Cipher.ENCRYPT_MODE, getKey(KEY_ALIAS, context), new GCMParameterSpec(128, FIXED_IV));
    } else {
      cipher = Cipher.getInstance(AES_MODE, "BC");
      cipher.init(Cipher.ENCRYPT_MODE, getKey(KEY_ALIAS, context));
    }
    byte[] encodedBytes = cipher.doFinal(stringToEncrypt.getBytes("UTF-8"));
    return Base64.encodeToString(encodedBytes, Base64.DEFAULT);
  }

  private static String decryptString(String stringToDecrypt, String KEY_ALIAS, Context context)
      throws GeneralSecurityException, IOException {
    byte[] encryptedData = Base64.decode(stringToDecrypt, Base64.DEFAULT);

    Cipher cipher;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      cipher = Cipher.getInstance(TRANSFORMATION);
      cipher.init(Cipher.DECRYPT_MODE, getKey(KEY_ALIAS, context), new GCMParameterSpec(128, FIXED_IV));
    } else {
      cipher = Cipher.getInstance(AES_MODE, "BC");
      cipher.init(Cipher.DECRYPT_MODE, getKey(KEY_ALIAS, context));
    }
    byte[] decryptedData = cipher.doFinal(encryptedData);
    return new String(decryptedData, "UTF-8");
  }


  private static Key getKey(String KEY_ALIAS, Context context) throws GeneralSecurityException, IOException {
    KeyStore.SecretKeyEntry secretKeyEntry = (KeyStore.SecretKeyEntry) getKeyStore().getEntry(KEY_ALIAS, null);
    if (secretKeyEntry != null) {
      return secretKeyEntry.getSecretKey();
    } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      KeyGenerator generator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, ANDROID_KEY_STORE);
      generator.init(new KeyGenParameterSpec.Builder(
          KEY_ALIAS,
          KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
          .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
          .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
          .setRandomizedEncryptionRequired(false)
          .build()
      );
      return generator.generateKey();
    } else {
      return getAESKey(KEY_ALIAS, context);
    }
  }

  private static KeyStore getKeyStore() throws KeyStoreException, CertificateException, NoSuchAlgorithmException, IOException {
    KeyStore keyStore = KeyStore.getInstance(ANDROID_KEY_STORE);
    keyStore.load(null);
    return keyStore;
  }

  private static Key getAESKey(String KEY_ALIAS, Context context)
      throws CertificateException, NoSuchPaddingException, InvalidKeyException,
      NoSuchAlgorithmException, KeyStoreException, NoSuchProviderException,
      UnrecoverableEntryException, IOException, InvalidAlgorithmParameterException {
    SharedPreferences sharedPreferences = context.getSharedPreferences("", Context.MODE_PRIVATE);
    String encryptedKeyB64 = sharedPreferences.getString(ENCRYPTED_KEY, null);
    if (encryptedKeyB64 == null) {
      byte[] key = new byte[16];
      SecureRandom secureRandom = new SecureRandom();
      secureRandom.nextBytes(key);
      byte[] encryptedKey = rsaEncrypt(key, KEY_ALIAS, context);
      encryptedKeyB64 = Base64.encodeToString(encryptedKey, Base64.DEFAULT);
      SharedPreferences.Editor edit = sharedPreferences.edit();
      edit.putString(ENCRYPTED_KEY, encryptedKeyB64);
      edit.apply();
      return new SecretKeySpec(key, "AES");
    } else {
      byte[] encryptedKey = Base64.decode(encryptedKeyB64, Base64.DEFAULT);
      byte[] key = rsaDecrypt(encryptedKey, KEY_ALIAS, context);
      return new SecretKeySpec(key, "AES");
    }
  }

  private static KeyStore.PrivateKeyEntry getPrivateKeyEntry(String KEY_ALIAS, Context context)
      throws NoSuchProviderException, NoSuchAlgorithmException, InvalidAlgorithmParameterException,
      CertificateException, KeyStoreException, IOException, UnrecoverableEntryException {
    KeyStore.PrivateKeyEntry privateKeyEntry = (KeyStore.PrivateKeyEntry) getKeyStore().getEntry(KEY_ALIAS, null);

    if (privateKeyEntry == null) {
      KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance(KeyProperties.KEY_ALGORITHM_RSA, ANDROID_KEY_STORE);
      keyPairGenerator.initialize(new KeyPairGeneratorSpec.Builder(context)
          .setAlias(KEY_ALIAS)
          .build());
      keyPairGenerator.generateKeyPair();
    }

    return privateKeyEntry;
  }

  private static byte[] rsaEncrypt(byte[] secret, String KEY_ALIAS, Context context)
      throws CertificateException, NoSuchAlgorithmException, KeyStoreException,
      IOException, UnrecoverableEntryException, NoSuchProviderException,
      NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException {
    KeyStore.PrivateKeyEntry privateKeyEntry = getPrivateKeyEntry(KEY_ALIAS, context);
    // Encrypt the text
    Cipher inputCipher = Cipher.getInstance(RSA_MODE, "AndroidOpenSSL");
    inputCipher.init(Cipher.ENCRYPT_MODE, privateKeyEntry.getCertificate().getPublicKey());

    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    CipherOutputStream cipherOutputStream = new CipherOutputStream(outputStream, inputCipher);
    cipherOutputStream.write(secret);
    cipherOutputStream.close();

    byte[] vals = outputStream.toByteArray();
    return vals;
  }

  private static byte[] rsaDecrypt(byte[] encrypted, String KEY_ALIAS, Context context)
      throws UnrecoverableEntryException, NoSuchAlgorithmException,
      KeyStoreException, NoSuchProviderException, NoSuchPaddingException,
      InvalidKeyException, IOException, CertificateException, InvalidAlgorithmParameterException {
    KeyStore.PrivateKeyEntry privateKeyEntry = getPrivateKeyEntry(KEY_ALIAS, context);
    Cipher output = Cipher.getInstance(RSA_MODE, "AndroidOpenSSL");
    output.init(Cipher.DECRYPT_MODE, privateKeyEntry.getPrivateKey());
    CipherInputStream cipherInputStream = new CipherInputStream(
        new ByteArrayInputStream(encrypted), output);
    ArrayList<Byte> values = new ArrayList<>();
    int nextByte;
    while ((nextByte = cipherInputStream.read()) != -1) {
      values.add((byte) nextByte);
    }

    byte[] bytes = new byte[values.size()];
    for (int i = 0; i < bytes.length; i++) {
      bytes[i] = values.get(i).byteValue();
    }
    return bytes;
  }

  public static class BiometricCredentialsAccessException extends RuntimeException {
  }
}
