package io.esecrets.capacitor.autofill.data.dao;

import android.annotation.SuppressLint;
import android.util.Log;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;

import org.json.JSONArray;
import org.json.JSONException;

import java.util.HashSet;
import java.util.Set;

@SuppressLint("NewApi")
public class CacheDao {
  private static final String TAG = CacheDao.class.getSimpleName();
  private final KeyValueDao kvDao;
  private JSObject cache;

  public CacheDao(KeyValueDao kvDao) {
    this.kvDao = kvDao;
  }

  public JSObject get() {
    if (cache == null) {
      cache = kvDao.get("cache")
          .map(itemsStr -> {
            try {
              return new JSObject(itemsStr);
            } catch (JSONException e) {
              Log.e(TAG, e.getMessage(), e);
              throw new CacheDeserializationException();
            }
          })
          .orElse(new JSObject());
    }
    return cache;
  }

  public Set<String> get(String key) {
    Set<String> items = new HashSet<>();
    if (!get().has(key))
      return items;

    try {
      JSONArray jsonArray = get().getJSONArray(key);
      for (int i = 0; i < jsonArray.length(); i++)
        items.add(jsonArray.getString(i));
      return items;
    } catch (JSONException e) {
      Log.e(TAG, e.getMessage(), e);
      throw new CacheDeserializationException();
    }
  }

  public void add(String key, String val) {
    JSObject cache = get();
    Set<String> items = get(key);
    items.add(val);
    cache.put(key, JSArray.from(items.toArray()));
    kvDao.set("cache", cache.toString());
  }

  public void clear() {
    cache = new JSObject();
    kvDao.deleteKey("cache");
  }

  public static class CacheDeserializationException extends RuntimeException {}
}
