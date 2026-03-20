package io.esecrets.capacitor.webintent;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import androidx.annotation.Nullable;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AndroidWebIntent")
public class AndroidWebIntentPlugin extends Plugin {

  @PluginMethod
  public void getLaunchIntent(PluginCall call) {
    if (getActivity() == null) {
      call.reject("No activity");
      return;
    }
    Intent intent = getActivity().getIntent();
    JSObject ret = new JSObject();
    if (intent == null) {
      call.resolve(ret);
      return;
    }
    String action = intent.getAction();
    if (action != null) {
      ret.put("action", action);
    }
    Bundle extras = intent.getExtras();
    JSObject extrasObj = new JSObject();
    if (extras != null) {
      for (String key : extras.keySet()) {
        Object val = extras.get(key);
        extrasObj.put(key, stringifyExtra(val));
      }
    }
    ret.put("extras", extrasObj);
    call.resolve(ret);
  }

  private static String stringifyExtra(@Nullable Object val) {
    if (val == null) {
      return "";
    }
    if (val instanceof Uri) {
      return val.toString();
    }
    return String.valueOf(val);
  }

  @PluginMethod
  public void startViewUrl(PluginCall call) {
    String url = call.getString("url");
    if (url == null || url.isEmpty()) {
      call.reject("url is required");
      return;
    }
    if (getActivity() == null) {
      call.reject("No activity");
      return;
    }
    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
    getActivity().startActivity(intent);
    call.resolve();
  }
}
