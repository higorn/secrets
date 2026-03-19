package io.esecrets.capacitor.autofill.data.model;

import android.annotation.SuppressLint;

import com.getcapacitor.JSObject;

import java.util.List;

@SuppressLint("NewApi")
public class SecretDataset {
  public String name;
  public List<FieldType> fields;

  public SecretDataset(String name, List<FieldType> fields) {
    this.name = name;
    this.fields = fields;
  }

  public SecretDataset(JSObject secret, List<FieldType> fields) {
    this.name = secret.getString("name");
    this.fields = fields;
    this.fields.forEach(f -> f.value = secret.getJSObject("content").getString(f.name));
  }
}
