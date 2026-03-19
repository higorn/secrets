package io.esecrets.capacitor.autofill.helper;

import android.annotation.SuppressLint;
import android.content.Context;
import android.database.sqlite.SQLiteDatabase;

import java.util.Set;

import io.esecrets.capacitor.autofill.data.dao.CacheDao;
import io.esecrets.capacitor.autofill.data.dao.KvDao;
import io.esecrets.capacitor.autofill.data.db.AppDatabaseBuilder;

@SuppressLint("NewApi")
public class CacheHelper {
  private CacheHelper() {
  }

  public static Set<String> findOnCacheByPackageName(Context context, String packageName) {
    try (SQLiteDatabase db = new AppDatabaseBuilder(context).build()) {
      KvDao kvDao = new KvDao(db);
      CacheDao dao = new CacheDao(kvDao);
      Set<String> items = dao.get(packageName);
      db.close();
      return items;
    }
  }

  public static void addToCache(Context context, String key, String val) {
    try (SQLiteDatabase db = new AppDatabaseBuilder(context).build()) {
      KvDao kvDao = new KvDao(db);
      CacheDao dao = new CacheDao(kvDao);
      dao.add(key, val);
    }
  }

  public static void clearCache(Context context) {
    try (SQLiteDatabase db = new AppDatabaseBuilder(context).build()) {
      KvDao kvDao = new KvDao(db);
      CacheDao dao = new CacheDao(kvDao);
      dao.clear();
    }
  }
}
