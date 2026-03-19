package io.esecrets.capacitor.autofill;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;
import android.view.autofill.AutofillManager;

import androidx.activity.result.ActivityResult;

@CapacitorPlugin(name = "Autofill")
public class AutofillPlugin extends Plugin {

  private static final String TAG = "AutofillPlugin";
  private AutofillManager autofillManager;
  private Autofill implementation = new Autofill();

  @Override
  public void load() {
    super.load();
    autofillManager = this.getContext().getSystemService(AutofillManager.class);
  }

  @PluginMethod()
  public void isAvailable(PluginCall call) {
    JSObject ret = new JSObject();
    ret.put("isAvailable", Build.VERSION.SDK_INT >= 26);
    Log.d(TAG, "API level: " + Build.VERSION.SDK_INT);
    call.resolve(ret);
  }

  @PluginMethod()
  public void enable(PluginCall call) {
    if (autofillManager != null && !autofillManager.hasEnabledAutofillServices()) {
      Intent intent = new Intent(Settings.ACTION_REQUEST_SET_AUTOFILL_SERVICE);
      intent.setData(Uri.parse("package:io.esecrets.capacitor.autofill"));
      Log.d(TAG, "enableService(): intent=" + intent);
      startActivityForResult(call, intent, "handleResult");
    } else {
      Log.d(TAG, "Sample service already enabled.");
    }
  }

  @PluginMethod()
  public void disable(PluginCall call) {
    if (autofillManager != null && autofillManager.hasEnabledAutofillServices()) {
      autofillManager.disableAutofillServices();
    } else {
      Log.d(TAG, "Sample service already disabled.");
    }
    call.resolve();
  }

  @PluginMethod()
  public void isEnabled(PluginCall call) {
    JSObject ret = new JSObject();
    ret.put("isEnabled", autofillManager.hasEnabledAutofillServices());
    call.resolve(ret);
  }

  @ActivityCallback
  private void handleResult(PluginCall call, ActivityResult result) {
    call.resolve();
  }
}
