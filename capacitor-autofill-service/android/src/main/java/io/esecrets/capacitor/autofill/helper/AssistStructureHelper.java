package io.esecrets.capacitor.autofill.helper;

import android.annotation.SuppressLint;
import android.app.assist.AssistStructure;
import android.service.autofill.FillContext;
import android.service.autofill.FillRequest;

import java.util.List;

@SuppressLint("NewApi")
public class AssistStructureHelper {
  private AssistStructureHelper() {
  }

  public static boolean notSupported(AssistStructure structure) {
    return structure.getActivityComponent().getClassName().contains("io.esecrets")
        || android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.O;
  }
}
