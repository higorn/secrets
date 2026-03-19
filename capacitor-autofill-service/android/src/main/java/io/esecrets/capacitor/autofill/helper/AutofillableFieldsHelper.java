package io.esecrets.capacitor.autofill.helper;

import android.annotation.SuppressLint;
import android.app.assist.AssistStructure;
import android.util.ArrayMap;
import android.util.Log;
import android.view.autofill.AutofillId;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.StringJoiner;

import io.esecrets.capacitor.autofill.ViewParser;
import io.esecrets.capacitor.autofill.data.dao.FieldTypeDao;
import io.esecrets.capacitor.autofill.data.model.FieldType;

import static java.util.Optional.ofNullable;

@SuppressLint("NewApi")
public class AutofillableFieldsHelper {
  public static final String TAG = "AutofillableFieldsUtils";

  private AutofillableFieldsHelper() {
  }

  public static List<FieldType> getAutofillableFields(ViewParser viewParser, FieldTypeDao fieldTypeDao) {
    List<FieldType> fields = new ArrayList<>();
    viewParser.parse((node, prevNode) -> populateFields(fields, node, prevNode, fieldTypeDao));
    return fields;
  }

  private static void populateFields(List<FieldType> fields, AssistStructure.ViewNode node,
                                     AssistStructure.ViewNode prevNode,
                                     FieldTypeDao fieldTypeDao) {
    List<FieldType> fieldTypes;
    String[] hints = node.getAutofillHints();
    if (hints == null) {
      if (node.getClassName() != null && node.getClassName().equals("android.widget.EditText")) {
        fieldTypes = getFieldTypes(node, fieldTypeDao);
        if (fieldTypes.isEmpty()
            && prevNode.getClassName() != null
            && prevNode.getClassName().equals("android.widget.TextView")) {
          fieldTypes = getFieldTypes(prevNode, fieldTypeDao);
        }
      } else
        return;
    } else
      fieldTypes = fieldTypeDao.findFieldTypeByHints(hints);

    if (fieldTypes.isEmpty())
      return;

    FieldType fieldType = fieldTypes.get(0);
    fieldType.node = node;
    fields.add(fieldType);
  }

  private static List<FieldType> getFieldTypes(AssistStructure.ViewNode node, FieldTypeDao fieldTypeDao) {
    String[] hints;
    List<FieldType> fieldTypes;
    hints = new String[]{
        ofNullable(node.getIdEntry()).orElse(""),
        ofNullable(node.getHint()).orElse(""),
        ofNullable(node.getText()).map(CharSequence::toString).orElse("")
    };
    fieldTypes = fieldTypeDao.findFieldTypeByHints(hints);
    return fieldTypes;
  }
}
