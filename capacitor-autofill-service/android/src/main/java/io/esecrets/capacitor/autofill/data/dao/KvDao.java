package io.esecrets.capacitor.autofill.data.dao;

import android.annotation.SuppressLint;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;

import java.util.Optional;

@SuppressLint("NewApi")
public class KvDao implements KeyValueDao {
  public static final String TABLE = "_esecretskv";
  private final SQLiteDatabase db;

  public KvDao(SQLiteDatabase db) {
    this.db = db;
  }

  @Override
  public Optional<String> get(String key) {
    String[] projection = {"value"};
    String selection = "key" + " = ? LIMIT 1";
    String[] selectionArgs = {key};

    Cursor cursor = db.query(
        TABLE,
        projection,
        selection,
        selectionArgs,
        null,
        null,
        null
    );
    cursor.moveToNext();
    if (cursor.getCount() == 0) return Optional.empty();
    String value = cursor.getString(0);
    cursor.close();
    return Optional.of(value.replaceAll("^\"|\"$", ""));
  }

  @Override
  public void set(String key, String val) {
    Optional<String> valueOpt = get(key);
    String sql = valueOpt.map(value -> "UPDATE _esecretskv SET value = ? WHERE key = ?")
        .orElse("INSERT INTO _esecretskv (value, key) VALUES (?, ?)");
    db.execSQL(sql, new Object[]{val, key});
  }

  @Override
  public void deleteKey(String key) {
    String sql = "DELETE FROM _esecretskv WHERE key = ?";
    db.execSQL(sql, new Object[]{key});
  }
}
