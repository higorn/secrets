package io.esecrets.capacitor.autofill.data.security;

import android.annotation.SuppressLint;
import android.util.Log;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import io.esecrets.capacitor.autofill.data.dao.VaultDao;

@SuppressLint("NewApi")
public class Vault {
  private static final String TAG = Vault.class.getSimpleName();
  private final VaultDao dao;
  private VaultKeysManager keysManager;

  public Vault(VaultDao dao) {
    this.dao = dao;
  }

  public void unseal(String password) {
    try {
      keysManager = new VaultKeysManager(dao.getAll(), password);
    } catch (VaultKeysManager.VaultKeyRestoringException e) {
      Log.e(TAG, e.getMessage(), e);
      throw new VaultUnsealException();
    }
  }

  public String encode(String data) {
    Cipher cipher = getCipher(Cipher.ENCRYPT_MODE);
    try {
      String encoded = Base64.getEncoder().encodeToString(data.getBytes());
      String urlEncoded = URLEncoder.encode(encoded);
      return Base64.getEncoder().encodeToString(cipher.doFinal(urlEncoded.getBytes()));
    } catch (BadPaddingException | IllegalBlockSizeException e) {
      Log.e(TAG, e.getMessage(), e);
      throw new VaultEncodingException();
    }
  }

  public String decode(byte[] encodedBytes) {
    byte[] decodedBytes = Base64.getDecoder().decode(encodedBytes);
    Cipher cipher = getCipher(Cipher.DECRYPT_MODE);
    try {
      String decrypted = new String(cipher.doFinal(decodedBytes));
      String decoded = new String(Base64.getDecoder().decode(decrypted));
      return URLDecoder.decode(decoded);
    } catch (BadPaddingException | IllegalBlockSizeException e) {
      Log.e(TAG, e.getMessage(), e);
      throw new VaultDecodingException();
    }
  }

  private Cipher getCipher(int encryptMode) {
    VaultKeysManager.VaultKey key = keysManager.getKey3();
    try {
      Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
      cipher.init(encryptMode, new SecretKeySpec(key.key, "AES"), new IvParameterSpec(key.iv, 0, 16));
      return cipher;
    } catch (NoSuchAlgorithmException | NoSuchPaddingException
        | InvalidAlgorithmParameterException | InvalidKeyException e) {
      Log.e(TAG, e.getMessage(), e);
      throw new VaultKeysManager.VaultKeyRestoringException();
    }
  }

  public static class VaultDecodingException extends RuntimeException {
  }

  public static class VaultEncodingException extends RuntimeException {
  }

  public static class VaultUnsealException extends RuntimeException {
  }
}

