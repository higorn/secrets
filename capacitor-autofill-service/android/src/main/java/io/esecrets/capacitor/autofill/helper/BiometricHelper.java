package io.esecrets.capacitor.autofill.helper;

import android.content.Context;
import android.content.res.Resources;

import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;

import java.util.concurrent.Executor;

import io.esecrets.capacitor.autofill.R;

import static androidx.biometric.BiometricManager.Authenticators.BIOMETRIC_STRONG;

public class BiometricHelper {

  private BiometricHelper() {
  }

  public static BiometricPrompt getBiometricPrompt(FragmentActivity fragmentActivity, Executor executor,
                                                   BiometricPrompt.AuthenticationCallback callback) {
    return new BiometricPrompt(fragmentActivity, executor, callback);
  }

  public static BiometricPrompt getBiometricPrompt(Fragment fragment, Executor executor,
                                                   BiometricPrompt.AuthenticationCallback callback) {
    return new BiometricPrompt(fragment, executor, callback);
  }

  public static BiometricPrompt.PromptInfo getBiometricPromptInfo(Resources resources) {
    return new BiometricPrompt.PromptInfo.Builder()
        .setTitle(resources.getString(R.string.biometric_title))
//        .setDescription(getIntent().hasExtra("description") ? getIntent().getStringExtra("description") : null)
        .setSubtitle(resources.getString(R.string.biometric_subtitle))
        .setNegativeButtonText(resources.getString(R.string.biometric_cancel_btn))
        .build();
  }

  public static boolean isBiometricAvailable(Context context) {
    BiometricManager biometricManager = BiometricManager.from(context);
    return biometricManager.canAuthenticate(BIOMETRIC_STRONG) == BiometricManager.BIOMETRIC_SUCCESS;
  }
}
