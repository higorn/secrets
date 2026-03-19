package io.esecrets.capacitor.autofill.data.dao;

import android.annotation.SuppressLint;
import android.content.res.Resources;
import android.util.Log;

import com.getcapacitor.JSArray;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import io.esecrets.capacitor.autofill.R;
import io.esecrets.capacitor.autofill.data.model.FieldType;

@SuppressLint("NewApi")
public class FieldTypeDao {
  public static final String TAG = FieldTypeDao.class.getSimpleName();

  private static FieldTypeDao instance;
  private final List<FieldType> fieldTypes;

  private FieldTypeDao(Resources resources) {
    this.fieldTypes = loadFieldTypes(resources);
  }

  public static FieldTypeDao getInstance(Resources resources) {
    if (instance == null) {
      instance = new FieldTypeDao(resources);
    }
    return instance;
  }

  private List<FieldType> loadFieldTypes(Resources resources) {
    InputStream is = resources.openRawResource(R.raw.field_types);
    String json = new BufferedReader(new InputStreamReader(is)).lines().collect(Collectors.joining("\n"));
    return getFieldTypes(json);
  }

  private List<FieldType> getFieldTypes(String json) {
    List<FieldType> fieldTypes = new ArrayList<>();
    try {
      JSArray jsArray = new JSArray(json);
      for (int i = 0; i < jsArray.length(); i++)
        fieldTypes.add(getFieldType(jsArray.getJSONObject(i)));
    } catch (JSONException e) {
      Log.e(TAG, e.getMessage(), e);
    }
    return fieldTypes;
  }

  private FieldType getFieldType(JSONObject obj) throws JSONException {
    return FieldType.of(obj.getString("name"), obj.getString("type"), obj.getInt("saveInfo"), getHints(obj));
  }

  private List<String> getHints(JSONObject obj) throws JSONException {
    List<String> hints = new ArrayList<>();
    JSONArray hintsArray = obj.getJSONArray("hints");
    for (int j = 0; j < hintsArray.length(); j++)
      hints.add(hintsArray.getString(j));
    return hints;
  }

  public List<FieldType> getFieldTypes() {
    return fieldTypes;
  }

  public List<FieldType> findFieldTypeByHints(String[] hints) {
    return fieldTypes.stream()
        .filter(ft -> Stream.of(hints)
            .anyMatch(h1 -> ft.hints.stream()
                .anyMatch(h2 -> h1.toUpperCase().contains(h2.toUpperCase()))))
        .collect(Collectors.toList());
  }
}
