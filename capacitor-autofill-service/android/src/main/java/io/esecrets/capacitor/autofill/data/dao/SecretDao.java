package io.esecrets.capacitor.autofill.data.dao;

import android.annotation.SuppressLint;
import android.util.Log;

import com.getcapacitor.JSObject;

import org.json.JSONArray;
import org.json.JSONException;

import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

import io.esecrets.capacitor.autofill.data.security.Vault;

@SuppressLint("NewApi")
public class SecretDao {
  private static final String TAG = SecretDao.class.getSimpleName();
  private final KeyValueDao kvDao;
  private final Vault vault;

  public SecretDao(KeyValueDao kvDao, Vault vault) {
    this.kvDao = kvDao;
    this.vault = vault;
  }

  public List<JSObject> getAll() {
    return kvDao.get("secrets")
        .map(encodedSecrets -> {
          try {
            JSONArray jsonArray = new JSONArray(vault.decode(encodedSecrets.getBytes()));
            List<JSObject> items = new ArrayList<>();
            for (int i = 0; i < jsonArray.length(); i++)
              items.add(JSObject.fromJSONObject(jsonArray.getJSONObject(i)));
            return items;
          } catch (JSONException | Vault.VaultDecodingException e) {
            Log.e(TAG, e.getMessage(), e);
            throw new SecretsDeserializationException();
          }
        })
        .orElse(new ArrayList<>())
        .stream().filter(s -> !s.has("removed") || !s.getBool("removed"))
        .collect(Collectors.toList());
  }

  public static class SecretsDeserializationException extends RuntimeException {
  }
}
