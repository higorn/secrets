package io.esecrets.capacitor.autofill.ui;

import android.annotation.SuppressLint;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.IntentSender;
import android.os.Bundle;
import android.service.autofill.Dataset;

import androidx.appcompat.app.AppCompatActivity;

import io.esecrets.capacitor.autofill.R;

@SuppressLint("NewApi")
public class AutofillActivity extends AppCompatActivity {
  private static int datasetPendingIntentId = 0;

  public static IntentSender getAuthIntentSender(Context context) {
    final Intent intent = new Intent(context, AutofillActivity.class);
    return PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_CANCEL_CURRENT).getIntentSender();
  }

  public static IntentSender getAuthIntentSenderForDataset(Context context, String datasetName) {
    final Intent intent = new Intent(context, AutofillActivity.class);
    intent.putExtra("datasetName", datasetName);
    return PendingIntent.getActivity(context, ++datasetPendingIntentId, intent, PendingIntent.FLAG_CANCEL_CURRENT)
        .getIntentSender();
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_autofill);
  }
}

