package io.esecrets.capacitor.googleauth;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginConfig;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.common.api.Scope;
import com.google.android.gms.tasks.Task;

import org.json.JSONArray;
import org.json.JSONException;


@CapacitorPlugin(name = "GoogleAuth")
public class GoogleAuthPlugin extends Plugin {

  private GoogleSignInClient googleSignInClient;
  private GoogleAuth implementation;

  @Override
  public void load() {
    googleSignInClient = GoogleSignIn.getClient(getContext(), getGoogleSignInOptions(getConfig()));
    implementation = new GoogleAuth(new TokenExtractor(getContext()));
  }

  private GoogleSignInOptions getGoogleSignInOptions(PluginConfig pluginConfig) {
    try {
      String clientId = (String) pluginConfig.getConfigJSON().get("serverClientId");
      Boolean forceRefreshToken = (Boolean) pluginConfig.getConfigJSON().get("forceCodeForRefreshToken");
      Scope[] scopes = getScopes(pluginConfig);
      GoogleSignInOptions.Builder googleSignInBuilder = new GoogleSignInOptions.Builder(
          GoogleSignInOptions.DEFAULT_SIGN_IN).requestEmail();
      googleSignInBuilder.requestServerAuthCode(clientId, forceRefreshToken == null ? false : forceRefreshToken);
      googleSignInBuilder.requestScopes(scopes[0], scopes);
      return googleSignInBuilder.build();
    } catch (JSONException e) {
      Log.e("JSON parse error", e.getMessage(), e);
      throw new RuntimeException(e);
    }
  }

  private Scope[] getScopes(PluginConfig pluginConfig) throws JSONException {
    JSONArray scopeArray = (JSONArray) pluginConfig.getConfigJSON().get("scopes");
    Scope[] scopes = new Scope[scopeArray.length()];
    for (int i = 0; i < scopeArray.length(); i++) {
      scopes[i] = new Scope(scopeArray.getString(i));
    }
    return scopes;
  }

  @PluginMethod
  public void signIn(PluginCall call) {
    doSignIn(call, "handleSignInResult", (account) -> implementation.signIn(call, account));
  }

  @PluginMethod
  public void refresh(final PluginCall call) {
    doSignIn(call, "handleRefreshResult", (account) -> implementation.refresh(call, account));
  }

  private void doSignIn(PluginCall call, String callBackName, AccountConsumer accountConsumer) {
    GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(getContext());
    if (account == null || account.getAccount() == null) {
      doSignInIntent(call, callBackName);
      return;
    }
    try {
      accountConsumer.accept(account);
    } catch (TokenExtractor.TokenVerificationException e) {
      doSignInIntent(call, callBackName);
    }
  }

  private void doSignInIntent(PluginCall call, String callBackName) {
    Intent signInIntent = googleSignInClient.getSignInIntent();
    startActivityForResult(call, signInIntent, callBackName);
  }

  @PluginMethod
  public void isSignedIn(final PluginCall call) {
    GoogleSignInAccount account = GoogleSignIn.getLastSignedInAccount(getContext());
    if (account == null) {
      call.reject("Not signed in");
      return;
    }
    call.resolve();
  }

  @PluginMethod
  public void signOut(final PluginCall call) {
    googleSignInClient.signOut();
    call.resolve();
  }

  @ActivityCallback
  private void handleSignInResult(PluginCall call, ActivityResult result) {
    handleResult(call, result, (account) -> implementation.signIn(call, account));
  }

  @ActivityCallback
  private void handleRefreshResult(PluginCall call, ActivityResult result) {
    handleResult(call, result, (account) -> implementation.refresh(call, account));
  }

  private void handleResult(PluginCall call, ActivityResult result, AccountConsumer accountConsumer) {
    if (result.getResultCode() == Activity.RESULT_CANCELED) {
      call.reject("Activity canceled");
      return;
    }
    Intent data = result.getData();
    Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);

    try {
      final GoogleSignInAccount account = task.getResult(ApiException.class);
      new Thread(() -> accountConsumer.accept(account)).start();
    } catch (ApiException e) {
      call.reject("Something went wrong", e);
    } catch (TokenExtractor.TokenVerificationException e) {
      call.reject(e.getMessage());
    }
  }

  interface AccountConsumer {
    void accept(GoogleSignInAccount account);
  }
}
