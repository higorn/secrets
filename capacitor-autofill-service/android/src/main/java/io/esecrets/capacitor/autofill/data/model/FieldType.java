package io.esecrets.capacitor.autofill.data.model;

import android.app.assist.AssistStructure;

import java.util.List;

public class FieldType {
  public final String name;
  public final String type;
  public final int saveInfo;
  public final List<String> hints;
  public String value;
  public AssistStructure.ViewNode node;

  private FieldType(String name, String type, int saveInfo, List<String> hints) {
    this.name = name;
    this.type = type;
    this.saveInfo = saveInfo;
    this.hints = hints;
  }

  public static FieldType of(String name, String type, int saveInfo, List<String> hints) {
    return new FieldType(name, type, saveInfo, hints);
  }
}
