package io.esecrets;

import android.content.res.Configuration;
import android.os.Bundle;
import android.webkit.WebSettings;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.util.ArrayList;
//import com.epicshaggy.biometric.NativeBiometric;
//import io.esecrets.capacitor.autofillservice.Autofill;

public class MainActivity extends BridgeActivity {
/*
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      add(NativeBiometric.class);
      add(Autofill.class);
    }});
  }
*/

  @Override
  public void onResume() {
    super.onResume();
    int nightModeFlags = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;
    WebSettings webSettings = this.bridge.getWebView().getSettings();

    if (nightModeFlags == Configuration.UI_MODE_NIGHT_YES) {
      if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
        webSettings.setForceDark(WebSettings.FORCE_DARK_ON);
      }
    } else {
      webSettings.setForceDark(WebSettings.FORCE_DARK_OFF);
    }
  }
}
