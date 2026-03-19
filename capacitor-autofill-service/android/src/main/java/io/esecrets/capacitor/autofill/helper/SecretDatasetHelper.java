package io.esecrets.capacitor.autofill.helper;

import android.annotation.SuppressLint;
import android.content.Context;
import android.database.sqlite.SQLiteDatabase;

import com.getcapacitor.JSObject;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import io.esecrets.capacitor.autofill.data.dao.KvDao;
import io.esecrets.capacitor.autofill.data.dao.SecretDao;
import io.esecrets.capacitor.autofill.data.dao.VaultDao;
import io.esecrets.capacitor.autofill.data.db.AppDatabaseBuilder;
import io.esecrets.capacitor.autofill.data.model.FieldType;
import io.esecrets.capacitor.autofill.data.model.SecretDataset;
import io.esecrets.capacitor.autofill.data.security.Vault;

@SuppressLint("NewApi")
public class SecretDatasetHelper {

  private SecretDatasetHelper() {
  }

  public static List<JSObject> getSecrets(Context context, String password) {
    try (SQLiteDatabase db = new AppDatabaseBuilder(context).build()) {
      KvDao kvDao = new KvDao(db);
      Vault vault = new Vault(new VaultDao(kvDao));
      vault.unseal(password);
      SecretDao dao = new SecretDao(kvDao, vault);
      List<JSObject> secrets = dao.getAll();
      db.close();
      return secrets;
    }
  }

  public static List<SecretDataset> getSecretDatasets(List<FieldType> fields, List<JSObject> secrets) {
    return secrets.stream()
        .filter(s -> hasFields(fields, s))
        .map(s -> new SecretDataset(s, fields))
        .collect(Collectors.toList());
  }

  public static List<SecretDataset> getSecretDatasets(List<FieldType> fields, Collection<String> secretNames) {
    return secretNames.stream()
        .map(s -> new SecretDataset(s, fields))
        .collect(Collectors.toList());
  }

  private static Boolean hasFields(List<FieldType> fields, JSObject s) {
    return fields.stream().anyMatch(f -> s.getJSObject("content").has(f.name));
  }
}
