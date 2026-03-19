package io.esecrets.capacitor.autofill;

import android.annotation.SuppressLint;
import android.app.assist.AssistStructure;
import android.content.IntentSender;
import android.os.CancellationSignal;
import android.os.Parcelable;
import android.service.autofill.AutofillService;
import android.service.autofill.Dataset;
import android.service.autofill.FillCallback;
import android.service.autofill.FillContext;
import android.service.autofill.FillRequest;
import android.service.autofill.FillResponse;
import android.service.autofill.SaveCallback;
import android.service.autofill.SaveInfo;
import android.service.autofill.SaveRequest;
import android.util.Log;
import android.view.autofill.AutofillId;
import android.view.autofill.AutofillValue;
import android.widget.RemoteViews;
import android.widget.Toast;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import io.esecrets.capacitor.autofill.data.dao.FieldTypeDao;
import io.esecrets.capacitor.autofill.data.model.FieldType;
import io.esecrets.capacitor.autofill.data.model.SecretDataset;
import io.esecrets.capacitor.autofill.ui.AutofillActivity;

import static io.esecrets.capacitor.autofill.helper.AssistStructureHelper.notSupported;
import static io.esecrets.capacitor.autofill.helper.AutofillableFieldsHelper.getAutofillableFields;
import static io.esecrets.capacitor.autofill.helper.CacheHelper.findOnCacheByPackageName;
import static io.esecrets.capacitor.autofill.helper.RemoteViewsHelper.simpleRemoteView;
import static io.esecrets.capacitor.autofill.helper.SecretDatasetHelper.getSecretDatasets;
import static java.util.stream.Collectors.toList;

@SuppressLint("NewApi")
public class SecretsAutofillService extends AutofillService {
  private static final String TAG = SecretsAutofillService.class.getSimpleName();
  private String clientPackageName;

  @Override
  public void onFillRequest(FillRequest request, CancellationSignal cancellationSignal, FillCallback callback) {
    List<FillContext> fillContexts = request.getFillContexts();
    List<AssistStructure> structures = fillContexts.stream().map(FillContext::getStructure).collect(toList());
    AssistStructure lastStructure = fillContexts.get(fillContexts.size() - 1).getStructure();
    if (notSupported(lastStructure)) {
      callback.onSuccess(null);
      return;
    }
    clientPackageName = lastStructure.getActivityComponent().getPackageName();

    doResponse(callback, new ViewParser(structures));
  }

  private void doResponse(FillCallback callback, ViewParser viewParser) {
    List<FieldType> fields = getAutofillableFields(viewParser, FieldTypeDao.getInstance(getResources()));
    Log.d(TAG, "autofillable fields:" + fields);

    if (fields.isEmpty()) {
      toast("No autofill hints found: " + clientPackageName);
      callback.onSuccess(null);
      return;
    }

    callback.onSuccess(buildResponseAuthDataset(fields));
  }

  private FillResponse buildResponseAuthDataset(List<FieldType> fields) {
    List<Dataset> datasetList = buildDatasets(fields);

    FillResponse.Builder response = new FillResponse.Builder();
    datasetList.forEach(response::addDataset);
    response.setSaveInfo(getSaveInfo(fields));
    return response.build();
  }

  private List<Dataset> buildDatasets(List<FieldType> fields) {
    List<Dataset> datasets = new ArrayList<>();
    AutofillId defaultId = fields.stream()
        .filter(f -> f.node.isFocused())
        .findFirst()
        .map(f -> f.node)
        .map(AssistStructure.ViewNode::getAutofillId).orElse(null);
    datasets.add(buildDefaultDataset(defaultId));

//    clearCache(this);
    Set<String> cachedItems = findOnCacheByPackageName(this, clientPackageName);
    List<SecretDataset> secretDatasets = getSecretDatasets(fields, cachedItems);
    datasets.addAll(secretDatasets.stream().map(secret -> {
      Dataset.Builder dataset = new Dataset.Builder(simpleRemoteView(getPackageName(), secret.name));
      dataset.setAuthentication(AutofillActivity.getAuthIntentSenderForDataset(this, secret.name));
      secret.fields.forEach(field -> dataset.setValue(field.node.getAutofillId(), AutofillValue.forText(field.value)));
      return dataset.build();
    }).collect(Collectors.toList()));

    return datasets;
  }

  @NotNull
  private Dataset buildDefaultDataset(AutofillId autofillId) {
    IntentSender authentication = AutofillActivity.getAuthIntentSenderForDataset(this, null);
    RemoteViews presentation = simpleRemoteView(getPackageName(), getString(R.string.autofill_auth_prompt));
    Dataset.Builder dataset = new Dataset.Builder(presentation);
    dataset.setValue(autofillId, null);
    dataset.setAuthentication(authentication);
    return dataset.build();
  }

  private FillResponse buildAuthResponse(Map<String, AutofillId> fields) {
    IntentSender authentication = AutofillActivity.getAuthIntentSender(this);
    RemoteViews presentation = simpleRemoteView(getPackageName(), getString(R.string.autofill_auth_prompt));
    AutofillId[] autofillIds = fields.values().toArray(new AutofillId[fields.size()]);
    FillResponse.Builder response = new FillResponse.Builder();
    response.setSaveInfo(new SaveInfo.Builder(SaveInfo.SAVE_DATA_TYPE_GENERIC, autofillIds).build());
    response.setAuthentication(autofillIds, authentication, presentation);
    return response.build();
  }

  private SaveInfo getSaveInfo(List<FieldType> fields) {
    Collection<? extends Parcelable> ids = fields.stream().map(f -> f.node.getAutofillId()).collect(Collectors.toList());
    AutofillId[] requiredIds = new AutofillId[ids.size()];
    ids.toArray(requiredIds);
    int saveType = fields.stream()
        .map(f -> f.saveInfo)
        .reduce((i1, i2) -> i1 | i2)
        .orElse(SaveInfo.SAVE_DATA_TYPE_GENERIC);
    return new SaveInfo.Builder(saveType, requiredIds).build();
  }

  @Override
  public void onSaveRequest(SaveRequest saveRequest, SaveCallback callback) {
    Log.d(TAG, "onSaveRequest()");
    toast("Save not supported");
    callback.onSuccess();
  }

  private void toast(CharSequence message) {
    Toast.makeText(getApplicationContext(), message, Toast.LENGTH_LONG).show();
  }

  @Override
  public void onConnected() {
    Log.d(TAG, "onConnected()");
    super.onConnected();
  }

  @Override
  public void onDisconnected() {
    Log.d(TAG, "onDisconnected()");
    super.onDisconnected();
  }
}
