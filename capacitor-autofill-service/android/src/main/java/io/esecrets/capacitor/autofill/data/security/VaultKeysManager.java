package io.esecrets.capacitor.autofill.data.security;

import android.annotation.SuppressLint;
import android.util.Log;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.security.spec.RSAPrivateCrtKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.List;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

@SuppressLint("NewApi")
public class VaultKeysManager {
  private static final String TAG = Vault.class.getSimpleName();
  private final List<String> vault;
  private final String password;
  private final Base64.Decoder decoder;
  private final VaultKey key1;
  private final KeyPair key2;
  private final VaultKey key3;

  public VaultKeysManager(List<String> vault, String password) {
    this.vault = vault;
    this.password = password;
    decoder = Base64.getDecoder();
    key1 = getKey1();
    key2 = getKey2();
    key3 = getKey3();
  }

  public VaultKey getKey1() {
    if (key1 != null)
      return key1;

    byte[] encodedKeyBytes = decoder.decode(vault.get(0));
    try {
      JSONObject encodedKeys = new JSONObject(new String(encodedKeyBytes));
      return new VaultKey(
          decoder.decode(encodedKeys.getString("salt")),
          decoder.decode(encodedKeys.getString("iv"))
      );
    } catch (JSONException e) {
      Log.e(TAG, e.getMessage(), e);
      throw new VaultKeyRestoringException();
    }
  }

  public KeyPair getKey2() {
    if (key2 != null)
      return key2;

    try {
      byte[] encodedKey = decoder.decode(vault.get(1));
      SecretKey secretKey = getSecretKey(password);
      JSONObject keyPairBundle = new JSONObject(decryptKey(encodedKey, secretKey, this.key1.iv));
      return getKeyPair(keyPairBundle);
    } catch (JSONException e) {
      Log.e(TAG, e.getMessage(), e);
      throw new VaultKeyRestoringException();
    }
  }

  public VaultKey getKey3() {
    if (key3 != null)
      return key3;

    try {
      byte[] encodedKey = decoder.decode(vault.get(2));
      Cipher cipher = Cipher.getInstance("RSA/ECB/PKCS1PADDING");
      cipher.init(Cipher.DECRYPT_MODE, key2.getPrivate());
      String decodedKeyContent = new String(cipher.doFinal(encodedKey));
      JSONObject decodedKey = new JSONObject(decodedKeyContent);
      return new VaultKey(
          decoder.decode(decodedKey.getString("key")),
          decoder.decode(decodedKey.getString("iv"))
      );
    } catch (InvalidKeyException | NoSuchAlgorithmException
        | NoSuchPaddingException | BadPaddingException
        | IllegalBlockSizeException | JSONException e) {
      Log.e(TAG, e.getMessage(), e);
      throw new VaultKeyRestoringException();
    }
  }

  private SecretKey getSecretKey(String password) {
    try {
      SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2withHmacSHA1");
      KeySpec spec = new PBEKeySpec(password.toCharArray(), key1.key, 10, 128);
      SecretKey tmp = factory.generateSecret(spec);
      SecretKey secretKey = new SecretKeySpec(tmp.getEncoded(), "AES");
      return secretKey;
    } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
      Log.e(TAG, e.getMessage(), e);
      throw new VaultKeyRestoringException();
    }
  }

  private String decryptKey(byte[] encodedKey, Key secretKey, byte[] iv) {
    try {
      Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
      cipher.init(Cipher.DECRYPT_MODE, secretKey, new IvParameterSpec(iv));
      return new String(cipher.doFinal(encodedKey));
    } catch (NoSuchAlgorithmException | NoSuchPaddingException
        | InvalidAlgorithmParameterException | InvalidKeyException
        | BadPaddingException | IllegalBlockSizeException e) {
      Log.e(TAG, e.getMessage(), e);
      throw new VaultKeyRestoringException();
    }
  }

  private KeyPair getKeyPair(JSONObject keyPairBundle) {
    try {
      KeyFactory kf = KeyFactory.getInstance("RSA");
      PublicKey pubKey = getPublicKey(keyPairBundle.getString("publicKey"), kf);
      PrivateKey privKey = getPrivateKey(keyPairBundle.getString("privateKey"), kf);
      return new KeyPair(pubKey, privKey);
    } catch (JSONException | NoSuchAlgorithmException e) {
      Log.e(TAG, e.getMessage(), e);
      throw new VaultKeyRestoringException();
    }
  }

  private PrivateKey getPrivateKey(String privKeyContent, KeyFactory kf) {
    privKeyContent = privKeyContent.replaceAll("\\r\\n", "")
        .replace("-----BEGIN RSA PRIVATE KEY-----", "")
        .replace("-----END RSA PRIVATE KEY-----", "");
    try {
      RSAPrivateCrtKeySpec privKeySpec = new PrivateKeyReader().getPrivateKeySpec(
          decoder.decode(privKeyContent));
      return kf.generatePrivate(privKeySpec);
    } catch (InvalidKeySpecException | IOException e) {
      Log.e(TAG, e.getMessage(), e);
      throw new VaultKeyRestoringException();
    }
  }

  private PublicKey getPublicKey(String pubKeyContent, KeyFactory kf) {
    pubKeyContent = pubKeyContent.replaceAll("\\r\\n", "")
        .replace("-----BEGIN PUBLIC KEY-----", "")
        .replace("-----END PUBLIC KEY-----", "");
    X509EncodedKeySpec keySpecX509 = new X509EncodedKeySpec(decoder.decode(pubKeyContent));
    try {
      return kf.generatePublic(keySpecX509);
    } catch (InvalidKeySpecException e) {
      Log.e(TAG, e.getMessage(), e);
      throw new VaultKeyRestoringException();
    }
  }

  public static class VaultKey {
    public final byte[] key;
    public final byte[] iv;

    public VaultKey(byte[] key, byte[] iv) {
      this.key = key;
      this.iv = iv;
    }
  }

  public static class VaultKeyRestoringException extends RuntimeException {
  }
}
