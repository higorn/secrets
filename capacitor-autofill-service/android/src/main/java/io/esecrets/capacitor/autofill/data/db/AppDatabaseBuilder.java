package io.esecrets.capacitor.autofill.data.db;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class AppDatabaseBuilder extends SQLiteOpenHelper {

  public AppDatabaseBuilder(Context context) {
    super(context, "esecrets.db", null, 1);
  }

  public SQLiteDatabase build() {
    return getWritableDatabase();
  }

  @Override
  public void onCreate(SQLiteDatabase db) {

  }

  @Override
  public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

  }
}
