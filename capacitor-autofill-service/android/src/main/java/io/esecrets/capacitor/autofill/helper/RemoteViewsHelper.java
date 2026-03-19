package io.esecrets.capacitor.autofill.helper;

import android.widget.RemoteViews;

import androidx.annotation.DrawableRes;

import io.esecrets.capacitor.autofill.R;

public final class RemoteViewsHelper {
  private RemoteViewsHelper() {
  }

  public static RemoteViews simpleRemoteView(String packageName, String text) {
    return simpleRemoteViews(packageName, text, R.drawable.ic_esecrets_48);
  }

  private static RemoteViews simpleRemoteViews(String packageName, String text, @DrawableRes int drawableId) {
    RemoteViews views = new RemoteViews(packageName, R.layout.multidataset_service_list_item);
    views.setTextViewText(R.id.text, text);
    views.setImageViewResource(R.id.icon, drawableId);
    return views;
  }
}
