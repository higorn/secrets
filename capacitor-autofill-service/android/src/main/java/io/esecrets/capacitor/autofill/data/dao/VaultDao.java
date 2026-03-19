package io.esecrets.capacitor.autofill.data.dao;

import android.annotation.SuppressLint;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;
import java.util.List;

@SuppressLint("NewApi")
public class VaultDao {
  private static final String TAG = VaultDao.class.getSimpleName();
  private final KeyValueDao kvDao;

  public VaultDao(KeyValueDao kvDao) {
    this.kvDao = kvDao;
  }

  public List<String> getAll() {
    try {
      JSONArray jsonArray = new JSONArray(kvDao.get("vault").orElseThrow(EmptyVaultException::new));
      List<String> items = new ArrayList<>();
      for (int i = 0; i < jsonArray.length(); i++)
        items.add(jsonArray.getString(i));
      return items;
    } catch (JSONException e) {
      Log.e(TAG, e.getMessage(), e);
      throw new VaultDeserializingException();
    }
  }

  public static class VaultDeserializingException extends RuntimeException {
  }

  public static class EmptyVaultException extends RuntimeException {
  }
}
